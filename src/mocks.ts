import axios, { AxiosError } from 'axios';
import MockAdapter from "axios-mock-adapter";
import { v4 as uuid } from "uuid";

export type OfficesResponse = {
    code: number;
    message: string;
    data: {
        id: string;
        title: string;
        address: string;
        detail: {
            fullname: string;
            job: string;
            email: string;
            phone: string;
        };
    }[];
};

export type AddOfficeBody = {
    title: string;
    address: string;
    fullname: string;
    job: string;
    email: string;
    phone: string;
};

const uuid1 = "550e8400-e29b-41d4-a716-446655440000";
const uuid2 = "7b1f3835-45b0-4d43-8c81-fc94478f2073";
const uuid3 = "9a519180-6abf-4c68-8124-6e167abff8f8";

let DATA: {
    id: string;
    title: string;
    address: string;
    detail: {
        fullname: string;
        job: string;
        email: string;
        phone: string;
    };
}[] = [
    {
        id: uuid1,
        title: "Headquarters",
        address: "3763 W. Dallas St.",
        detail: {
            fullname: "Hellena John",
            job: "Software Tester",
            email: "georgia.young@example.com",
            phone: "(808) 555-0111",
        },
    },
    {
        id: uuid2,
        title: "Headquarters",
        address: "3763 W. Dallas St.",
        detail: {
            fullname: "Hellena John",
            job: "Software Tester",
            email: "georgia.young@example.com",
            phone: "(808) 555-0111",
        },
    },
    {
        id: uuid3,
        title: "Headquarters",
        address: "3763 W. Dallas St.",
        detail: {
            fullname: "Hellena John",
            job: "Software Tester",
            email: "georgia.young@example.com",
            phone: "(808) 555-0111",
        },
    },
];

let mock = new MockAdapter(axios, { delayResponse: 0 });

mock.onGet("/offices").reply(200, {
    code: 200,
    message: "Get Success",
    data: DATA,
});

mock.onPost("/office").reply(async (config) => {
    const { title, address, fullname, job, email, phone } = JSON.parse(config.data);
    const newOffice = {
        id: uuid(),
        title,
        address,
        detail: {
            fullname,
            job,
            email,
            phone,
        },
    };

    DATA.unshift(newOffice);
    
    await fetchOffices();
    
    return [200, { code: 200, message: "The location has been added.", data: newOffice }];
});


mock.onPut(/\/office\/\d+/).reply(async (config) => {
    const officeId = config.url?.split("/").pop();
    if (officeId) {
        const { title, address, fullname, job, email, phone } = JSON.parse(config.data);
        const updatedOfficeIndex = DATA.findIndex(office => office.id === officeId);
        if (updatedOfficeIndex !== -1) {
            DATA[updatedOfficeIndex] = {
                ...DATA[updatedOfficeIndex],
                title,
                address,
                detail: {
                    fullname,
                    job,
                    email,
                    phone,
                },
            };
            await fetchOffices();
            return [200, { code: 200, message: "The location has been updated." }];
        }
    }

    return [400, { code: 400, message: "Invalid request." }];
});


mock.onDelete(/\/office\/\d+/).reply(async (config) => {
    const idToDelete = config.url?.split("/").pop()?.toString();
    if (idToDelete) {
        DATA = DATA.filter((office) => office.id !== idToDelete);
    }
    
    await fetchOffices();
    
    return [200, { code: 200, message: "The location has been deleted." }];
});

export const fetchOffices = async () => {
    const { data } = await axios.get<OfficesResponse>("/offices");
    return data;
};

export const addOffice = async (values: AddOfficeBody) => {
    const { data } = await axios.post("/office", values);
    return data;
};

export const updateOffice = async (id: string, values: AddOfficeBody) => {
    try {
        const response = await axios.put(`/office/${id}`, values);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<unknown>;
            if (axiosError.response?.status === 404) {
                throw new Error(`Office with ID ${id} not found.`);
            } else if (axiosError.response?.status === 403) {
                throw new Error(`You are not authorized to update this office.`);
            } else {
                throw new Error(`Failed to update office: ${axiosError.message}`);
            }
        } else {
            throw new Error(`Failed to update office: ${error}`);
        }
    }
};

export const deleteOffice = async (id: string) => {
    try {
        const index = DATA.findIndex(office => office.id === id);
        
        if (index >= 0) {
            DATA.splice(index, 1);
            return { code: 200, message: "The office has been deleted." };
        } else {
            return { code: 404, message: "Office not found for deletion." };
        }
    } catch (error) {
        console.error('Error deleting office:', error);
        throw error;
    }
};

