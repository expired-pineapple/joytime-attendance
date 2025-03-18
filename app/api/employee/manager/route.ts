import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';

import bycrpt from "bcrypt";


import { db } from "@/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser();

    if (!currentUser) return NextResponse.json({error: "Unauthorized"}, {status: 401});
    if (!currentUser.isAdmin) return NextResponse.json({error: "Unauthorized"}, {status: 403});

    const body = await request.json();
    const { name, employeeNumber, formula, password } = body;
    const hashedPassword = await bycrpt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                employeeNumber: employeeNumber.toLowerCase(),
                password: hashedPassword,
                isManager: true,
            },
        });

        return NextResponse.json({ message: "Manager created successfully" }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}

function handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const target = error.meta?.target as string[];
            if (target && target.length > 0) {
                let field = target[0];
                if (field == "employeeNumber"){
                  field="Employee Number"
                }
                return NextResponse.json({ message: `${field} already exists` }, { status: 400 });
            }
        }
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
}

export async function GET(request: NextRequest) {
    try{
        const user= await getCurrentUser();
        if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});
        if(!user.isAdmin && !user.isManager) return NextResponse.json({error: "Unauthorized"}, {status: 401});

        

        const employees = await db.employee.findMany({
            where:{
                user:{
                    isManager: true,
                }
            },
            include: {
                user: true
            }
        });
        const e = employees.map(employee => {
            return {
                ...employee,
               name: employee.user.name,
               employeeNumber: employee.user.employeeNumber.toUpperCase(),
            }
        })
        return NextResponse.json(e);
    }catch(error){
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }    
  }




