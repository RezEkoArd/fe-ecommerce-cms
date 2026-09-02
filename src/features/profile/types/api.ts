// GET /me — camelCase, berbeda dari endpoint lain yang PascalCase
// karena handler user memakai struct response sendiri.
export type Profile = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "customer";
    phone: string;
    /** Format YYYY-MM-DD, cocok untuk <input type="date">. Kosong = belum diisi. */
    birth_date: string;
};
