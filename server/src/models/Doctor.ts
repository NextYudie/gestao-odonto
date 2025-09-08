import { executeQuery, executeQuerySingle } from "@/config/database";
import { Doctor, PaginatedResponse } from "@/types";

export class DoctorModel {
  static async findById(id: number): Promise<Doctor | null> {
    const query = `SELECT * FROM doctors WHERE id = ?`;
    return executeQuerySingle<Doctor>(query, [id]);
  }

  static async findByCro(cro: string): Promise<Doctor | null> {
    const query = `SELECT * FROM doctors WHERE cro = ?`;
    return await executeQuerySingle<Doctor>(query, [cro]);
  }

  static async findAll(
    limit = 20,
    offset = 0,
    search?: string
  ): Promise<PaginatedResponse<Doctor>> {
    let query = `
      SELECT * FROM doctors
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (name LIKE ? OR cro LIKE ? OR email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
    const countResult = await executeQuerySingle<{ total: number }>(
      countQuery,
      params
    );
    const total = countResult?.total || 0;

    // Get paginated data
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const data = await executeQuery<Doctor>(query, params);

    return {
      data,
      pagination: {
        current_page: Math.floor(offset / limit) + 1,
        per_page: limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  static async create(
    doctorData: Omit<Doctor, "id" | "created_at" | "updated_at">
  ): Promise<number> {
    const query = `
      INSERT INTO doctors (name, email, phone, cro, specialty, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result: any = await executeQuery(query, [
      doctorData.name,
      doctorData.email || null,
      doctorData.phone || null,
      doctorData.cro,
      doctorData.specialty,
      doctorData.status || "active",
    ]);

    return result.insertId;
  }

  static async update(
    id: number,
    doctorData: Partial<Doctor>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(doctorData).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== "id" &&
        key !== "created_at" &&
        key !== "updated_at"
      ) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);

    const query = `UPDATE doctors SET ${fields.join(", ")} WHERE id = ?`;
    const result: any = await executeQuery(query, values);
    console.log(result);
    return result.length > 0 && result[0].changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM doctors WHERE id = ?`;
    const result: any = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  static async updateStatus(
    id: number,
    status: "active" | "inactive"
  ): Promise<boolean> {
    const query = `UPDATE doctors SET status = ? WHERE id = ?`;
    const result: any = await executeQuery(query, [status, id]);
    return result.affectedRows > 0;
  }

  static async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM doctors WHERE status = 'active'`;
    const result = await executeQuerySingle<{ count: number }>(query);
    return result?.count || 0;
  }

  static async getDoctorStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    new_this_month: number;
  }> {
    const queries = [
      `SELECT COUNT(*) as total FROM doctors`,
      `SELECT COUNT(*) as active FROM doctors WHERE status = 'active'`,
      `SELECT COUNT(*) as inactive FROM doctors WHERE status = 'inactive'`,
      `SELECT COUNT(*) as new_this_month FROM doctors WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
    ];

    const [totalResult, activeResult, inactiveResult, newThisMonthResult] =
      await Promise.all(
        queries.map((query) =>
          executeQuerySingle<{ [key: string]: number }>(query)
        )
      );

    return {
      total: totalResult?.total || 0,
      active: activeResult?.active || 0,
      inactive: inactiveResult?.inactive || 0,
      new_this_month: newThisMonthResult?.new_this_month || 0,
    };
  }
}
