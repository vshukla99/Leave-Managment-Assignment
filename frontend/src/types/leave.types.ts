export interface Leave {
  id: number;
  userId: number;
  fromDate: string;
  toDate: string;
  hoursRequested: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}


export interface LeaveBalance {
  totalGranted: number;
  totalUsed: number;
  totalRemaining: number;
}