export interface Attendance {
  id: string;
  employeeNumber: string;
  employeeName: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  duration: string;
  hasCheckedInToday: boolean;
  hasCheckedOutToday: boolean;
  edited: Boolean
}


export interface User{
  id: string;
  name: string;
  employeeNumber: string;
  isBanned: boolean
}

export interface timestamp{
    id: string;
    employeeId: string;
    date: string;
    check_in_time: string;
    check_out_time: string;

}

export interface Employee{
    id: string;
    employeeNumber?: string;
    user: User;
    timestamps: timestamp[]
    formula: string;
    hasCheckedInToday: boolean;
    hasCheckedOutToday: boolean;
    projectedHours: number;
}




export interface PayrollPeriod {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
}


export interface Payroll{
  id: string
  user: User;
  earnings: number;
  employeeId: string;
  employeeName:string;
  endDate: string | Date;
  startDate: string | Date;
  totalWorkedHours: number;
  confirmation: boolean;
  overtimeEarnings: number;
  overtimeHours: number;
  projectedPay: number;
  overtimePay: number;
}