import { NextRequest, NextResponse } from "next/server";;

import { db } from "@/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || (!user.isAdmin && !user.isManager)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();

        await db.$transaction(async (tx) => {
            const existingEmployee = await tx.employee.findUnique({
                where: { id },
                include: { user: true  } },
            );

            const { user: userData,  ...employeeData } = body;
            
            
            const userUpdateData: any = {
                ...userData,
            };
            if( existingEmployee == null){
                return NextResponse.json({ error: "Employee not found" }, { status: 404 });
            }
           
            const updatedUser = await tx.user.update({
                where: { id: existingEmployee?.userId },
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
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}


