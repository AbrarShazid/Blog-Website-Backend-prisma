import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/authMiddleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin Shazid",
      email: "abraragmain75@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };

    //check user exist on db or not

    const existinguser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existinguser) {
      throw new Error("User already exists!");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
      const updateVerified = await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
