import {Address, User} from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest
} from "../model/address-model";
import {Validation} from "../validation/validation";
import {AddressValidation} from "../validation/address-validation";
import {ContactService} from "./contact-service";
import {prisma} from "../application/database";
import {ResponseError} from "../error/response-error";

export class AddressService {

  static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
    const createRequest = Validation.validate(AddressValidation.CREATE, request);
    await ContactService.contactExists(user.username, createRequest.contact_id);

    const address = await prisma.address.create({
      data: createRequest
    });

    return toAddressResponse(address);
  }

  static async addressExists(contactId: number, addressId: number): Promise<Address> {
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId
      }
    });

    if (!address) {
      throw new ResponseError(404, "Alamat tidak ditemukan!")
    }

    return address;
  }

  static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.contactExists(user.username, getRequest.contact_id);
    const address = await this.addressExists(getRequest.contact_id, getRequest.id);

    return toAddressResponse(address);
  }

  static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
    const updateRequest = Validation.validate(AddressValidation.UPDATE, request);
    await ContactService.contactExists(user.username, updateRequest.contact_id);
    await this.addressExists(updateRequest.contact_id, updateRequest.id);

    const address = await prisma.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id
      },
      data: updateRequest
    })

    return toAddressResponse(address);
  }

  static async delete(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
    const deleteRequest = Validation.validate(AddressValidation.DELETE, request);
    await ContactService.contactExists(user.username, deleteRequest.contact_id);
    await this.addressExists(deleteRequest.contact_id, deleteRequest.id);

    const address = await prisma.address.delete({
      where: {
        id: deleteRequest.id
      }
    });

    return toAddressResponse(address);
  }

  static async list(user: User, contactId: number): Promise<Array<AddressResponse>> {
    await ContactService.contactExists(user.username, contactId);

    const addresses = await prisma.address.findMany({
      where: {
        contact_id: contactId
      }
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}