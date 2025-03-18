// Import necessary modules
import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from '@/app/actions/getCurrentUser';
import { db } from "@/lib/db";
import { calculateEarnings } from "@/lib/calculateEarnings";


export async function POST(request: NextRequest) {
    try {

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }


        const employee = await db.employee.findUnique({
            where: { userId: user.id},
            include:{
                user: true
            }
        });

        if (!employee) {
            return NextResponse.json({ error: "User is not associated with an employee" }, { status: 404 });
        }

        const currentDate = new Date();


        const ongoingCheckinSessions = await db.checkInOut.findMany({
            where: {
                employeeId: employee.id,
                check_out_time: null,
                date: { gte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) }
            }
        });


        if (ongoingCheckinSessions.length === 0) {
            return NextResponse.json({ message: "You haven't checked in yet" }, { status: 400 });
        }

     
        const updatedSessions = await Promise.all(
            ongoingCheckinSessions.map(async (session: { id: any; check_in_time: { getTime: () => number; }; }) => {
                const checkOut = await db.checkInOut.update({
                    where: { id: session.id },
                    data: { check_out_time: currentDate }
                });
            }
            ))

        return NextResponse.json({ message: "Check-out successful", updatedSessions }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await db.$disconnect();
    }
}
