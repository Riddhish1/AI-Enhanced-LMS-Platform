import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Course, Module } from '../types';

interface CourseState {
  courses: Course[];
  filteredCourses: Course[];
  currentCourse: Course | null;
  currentModule: Module | null;
  isLoading: boolean;
  error: string | null;
  
  fetchCourses: () => Promise<void>;
  fetchCourseDetails: (courseId: string) => Promise<void>;
  filterCourses: (query: string, difficulty?: string) => void;
  createCourse: (course: Omit<Course, 'id' | 'created_at'>, modules?: Omit<Module, 'id' | 'created_at' | 'course_id'>[]) => Promise<void>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  filteredCourses: [],
  currentCourse: null,
  currentModule: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    try {
      console.log('Fetching courses...');
      set({ isLoading: true, error: null });
      
      try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

        console.log('Courses fetch response:', { data, error });

        if (error) {
          console.error('Supabase error when fetching courses:', error);
          throw error;
        }

        console.log('Setting courses state with data:', data);
      set({ 
        courses: data || [], 
        filteredCourses: data || [],
        isLoading: false 
      });
        console.log('Courses state updated successfully.');
      } catch (supabaseError) {
        console.error('Error fetching from Supabase, using fallback data:', supabaseError);
        
        // Fallback data if Supabase connection fails
        const fallbackCourses = [
          {
            id: 'fallback-1',
            title: 'Introduction to 3D Modeling',
            description: 'Learn the basics of 3D modeling with industry standard tools',
            thumbnail_url: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg',
            difficulty: 'beginner',
            duration: 5,
            created_at: new Date().toISOString()
          },
          {
            id: 'fallback-2',
            title: 'Advanced VFX Techniques',
            description: 'Master advanced visual effects for film and games',
            thumbnail_url: 'https://images.pexels.com/photos/6238118/pexels-photo-6238118.jpeg',
            difficulty: 'advanced',
            duration: 10,
            created_at: new Date().toISOString()
          }
        ];
        
        set({ 
          courses: fallbackCourses, 
          filteredCourses: fallbackCourses,
          isLoading: false,
          error: 'Using demo courses - database connection failed' 
        });
      }
    } catch (error) {
      console.error('Unexpected error in fetchCourses:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        courses: [],
        filteredCourses: []
      });
    }
  },

  fetchCourseDetails: async (courseId) => {
    try {
      set({ isLoading: true, error: null, currentCourse: null, currentModule: null });
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch modules for this course
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });

      if (modulesError) throw modulesError;

      const course = {
        ...courseData,
        modules: modulesData || []
      };

      const firstModule = modulesData && modulesData.length > 0 ? modulesData[0] : null;

      set({ 
        currentCourse: course,
        currentModule: firstModule,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching course details:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch course details' 
      });
    }
  },

  filterCourses: (query, difficulty) => {
    const { courses } = get();
    let filtered = [...courses];
    
    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        course => 
          course.title.toLowerCase().includes(lowerQuery) || 
          course.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by difficulty
    if (difficulty) {
      filtered = filtered.filter(course => course.difficulty === difficulty);
    }
    
    set({ filteredCourses: filtered });
  },

  createCourse: async (course, modules = []) => {
    try {
      console.log('Starting course creation process...', { course, modules });
      set({ isLoading: true, error: null });
      
      // Check if the user is authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('Cannot create course: User is not authenticated');
        set({ 
          isLoading: false, 
          error: 'You must be logged in to create courses' 
        });
        return;
      }
      
      console.log('User is authenticated, proceeding with course creation');
      let courseData = null;
      let createdCourseId = null;
      let successfulSave = false;
      
      try {
        // Insert the course
        console.log('Inserting course into database...');
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select();

        console.log('Course insert response:', { data, error });
        
        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }
        
        courseData = data;
        successfulSave = true;
        
        if (data && data.length > 0) {
          createdCourseId = data[0].id;
          console.log('Successfully created course with ID:', createdCourseId);
        }
      } catch (supabaseError) {
        console.error('Failed to create course in Supabase, creating locally:', supabaseError);
        
        // Create a local course object with a UUID-formatted temporary ID
        // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is any hex digit and y is 8, 9, a, or b
        const generateUUID = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };
        
        const tempId = generateUUID();
        courseData = [{
          ...course,
          id: tempId,
          created_at: new Date().toISOString()
        }];
        createdCourseId = tempId;
      }
      
      // If we have modules and the course was created (either in Supabase or locally)
      if (modules.length > 0 && createdCourseId) {
        console.log('Course created, now creating modules for course ID:', createdCourseId);
        
        // Generate a UUID function
        const generateUUID = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        };
        
        // Prepare modules with the course_id
        const modulesWithCourseId = modules.map((module) => ({
          ...module,
          id: generateUUID(),
          course_id: createdCourseId,
          created_at: new Date().toISOString()
        }));
        
        console.log('Inserting modules:', modulesWithCourseId);
        
        try {
          // Insert modules
          const { data: moduleData, error: modulesError } = await supabase
            .from('modules')
            .insert(modulesWithCourseId)
            .select();
            
          console.log('Module insert response:', { moduleData, modulesError });
            
          if (modulesError) {
            console.error('Error creating modules in Supabase:', modulesError);
            throw modulesError;
          }
        } catch (moduleError) {
          console.error('Failed to create modules in Supabase, only updating local state');
          // We continue without throwing to update the local state
        }
      }
      
      // Always refresh courses from server if we successfully saved to Supabase
      if (successfulSave) {
        console.log('Successfully saved to Supabase, refreshing courses from server...');
        await get().fetchCourses();
        console.log('Courses refreshed from server');
      } 
      // Otherwise update the local state with the new course
      else if (courseData && courseData.length > 0) {
        console.log('Updating local state with new course');
        const { courses } = get();
        const updatedCourses = [courseData[0], ...courses];
        
        set({
          courses: updatedCourses,
          filteredCourses: updatedCourses,
          isLoading: false
        });
        
        console.log('Local state updated with new course');
      } else {
        console.log('No course data to update local state');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create course' 
      });
    }
  },

  updateCourse: async (courseId, updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', courseId);

      if (error) throw error;
      
      // Refresh the courses list and current course
      if (get().currentCourse?.id === courseId) {
        await get().fetchCourseDetails(courseId);
      }
      await get().fetchCourses();
      
    } catch (error) {
      console.error('Error updating course:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update course' 
      });
    }
  },

  deleteCourse: async (courseId) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('Deleting course with ID:', courseId);
      
      // First delete related modules
      const { error: modulesError } = await supabase
        .from('modules')
        .delete()
        .eq('course_id', courseId);
        
      if (modulesError) {
        console.error('Error deleting modules:', modulesError);
        // Continue with course deletion even if modules deletion fails
      }
      
      // Then delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        console.error('Error deleting course:', error);
        throw error;
      }
      
      // Update the state by removing the deleted course
      const { courses } = get();
      const updatedCourses = courses.filter(course => course.id !== courseId);
      
      set({
        courses: updatedCourses,
        filteredCourses: updatedCourses.filter(course => 
          get().filteredCourses.some(fc => fc.id === course.id)
        ),
        isLoading: false,
        currentCourse: get().currentCourse?.id === courseId ? null : get().currentCourse
      });
      
      console.log('Course deleted successfully');
    } catch (error) {
      console.error('Failed to delete course:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete course' 
      });
    }
  },
}));