import {prisma} from "../src/application/database";
import bcrypt from "bcrypt";
import {Address, Contact, User} from "@prisma/client";

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: "test"
      }
    })
  }

  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        name: "test",
        password: await bcrypt.hash("password", 10),
        token: "test"
      }
    })
  }

  static async get(): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        username: "test"
      }
    })

    if (!user) {
      throw new Error("User not found!")
    }

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prisma.contact.deleteMany({
      where: {
        username: "test"
      }
    })
  }

  static async create() {
    await prisma.contact.create({
      data: {
        first_name: "test",
        last_name: "test",
        email: "test@example.com",
        phone: "08123456789",
        username: "test"
      }
    })
  }

  static async get(): Promise<Contact> {
    const contact = await prisma.contact.findFirst({
      where: {
        username: "test"
      }
    })

    if (!contact) {
      throw new Error("Kontak tidak ditemukan")
    }

    return contact;
  }
}

export class AddressTest {

  static async deleteAll() {
    await prisma.address.deleteMany({
      where: {
        contact: {
          username: "test"
        }
      }
    })
  }

  static async create() {
    const contact = await ContactTest.get();
    await prisma.address.create({
      data: {
        contact_id: contact.id,
        street: "Jalan test",
        city: "Sleman test",
        province: "Test Yogyakarta",
        country: "Indonesia test",
        postal_code: "55555",
      }
    })
  }

  static async get(): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        contact: {
          username: "test"
        }
      }
    })

    if (!address) {
      throw new Error("Alamat tidak ditemukan!")
    }

    return address;
  }
}