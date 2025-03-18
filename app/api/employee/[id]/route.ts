import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function GET(request: NextRequest,  { params }: { params: { id: string } }) {
    try{
        const user= await getCurrentUser();
        if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        if(!user.isAdmin) return NextResponse.json({error: "Unauthorized"}, {status: 401});

        const { id } = params;

        const employees = await db.employee.findUnique({
            where: {
                id: id
            },
            include: {
                user: true
                  
            }
        });

        return NextResponse.json(employees);
    }catch(error){
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }    
  }





  export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || (!user.isAdmin)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        const result = await db.$transaction(async (tx) => {
            const existingEmployee = await tx.employee.findUnique({
                where: { id },
                include: { user:true },
            });

            if (!existingEmployee) {
                throw new Error("Employee not found");
            }

            const { user: userData, ...employeeData } = body;
           
            const userUpdateData: any = {
                ...userData,
            };

            const updatedUser = await tx.user.update({
                where: { id: existingEmployee.user.id },
                data: userUpdateData,
              
            });

            const updatedEmployee = await tx.employee.update({
                where: { id },
                data: {
                    ...employeeData,
                    projectedHour: employeeData.projectedHour,
                },
            });

            return { updatedEmployee, updatedUser };
        }, {
            timeout: 10000,
            maxWait: 5000,
            isolationLevel: 'Serializable'
        });


        return NextResponse.json({ message: "Employee updated successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error instanceof Error && error.message === "Employee not found") {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
  export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const result = await db.$transaction(async (tx) => {
            // Find the employee
            const employee = await tx.employee.findUnique({
                where: { id: params.id },
                include: { user: true }
            });

            if (!employee) {
                throw new Error("Employee not found");
            }

            await tx.checkInOut.deleteMany({
                where: {employeeId : employee.id }
            });

            // Delete the employee
            await tx.employee.delete({
                where: { id: params.id }
            });

            // Delete the associated user
            await tx.user.delete({
                where: { id: employee.user.id }
            });

            return employee;
        });

        return NextResponse.json({ message: "Employee data deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting employee:', error);
        if (error instanceof Error && error.message === "Employee not found") {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
