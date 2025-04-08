export interface Course {
    Course_ID: number;
    Course_Name: string;
    Course_URL: string;
    Is_Completed: boolean;
    Latest_Score: number;
    Completion_Date: string;
    Due_Date: string;
    Total_Users_Assigned: number;
    Total_Users_Completed: number;
    Total_Overdue: number;
    Average_Score: number;
    Due_Days: number;
}
    
export interface LearningPath {
	Path_Name: string;
	Path_Description: string;
	Path_Category: string;
	Assigned_Date: string;
	Due_Date: string;
	Is_Completed: boolean;
	Learning_Path_ID: number;
	Due_Days: number;
	Average_Score: number;
	Total_Users_Assigned: number;
	Total_Users_Completed: number;
	Total_Overdue: number;
	Courses: Course[]; 
}
  
export interface Option {
    Option_ID: number;
    Option_Text: string;
}
    
export interface Question {
    Question_ID: number;
    Question_Text: string;
    Options: Option[];
}
    
export interface User {
    User_ID: number;
    Name: string;
    Email: string;
    Stream: string;
    Designation: string;
}

export interface Reportee {
    User_ID: number;
    Name: string;
    Email: string;
    Designation: string;
    Stream: string;
    Learning_Paths: LearningPath[];
}
    