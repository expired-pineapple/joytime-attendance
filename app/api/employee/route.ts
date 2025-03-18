import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
    try {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      if (!user.isAdmin && !user.isManager) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  
      let whereCondition: any = {
        user: {
          isManager: false,
          isAdmin: false,
        }
      };

      const employees = await db.employee.findMany({
        where:whereCondition,
        include: {
          user:true
        }
          
        });
  
      const formattedEmployees = employees.map(employee => ({
        ...employee,
        name: employee.user.name,
        employeeNumber: employee.user.employeeNumber.toUpperCase()
      }));
  
      return NextResponse.json({
        employee: formattedEmployees,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Error in GET function:", error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }


