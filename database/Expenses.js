import { REPORT_GROUPS } from "../config/consts"
import { DBDto } from "../services/dto/DBDto"
import { AbstractDatabase } from "./Abstract/AbstarctDatabase"

export class Expenses extends AbstractDatabase {
	constructor() {
		super()
		this.tableName = "expenses"
	}

	async create() {
		const sql =
			"CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT,created_at DATETIME DEFAULT CURRENT_TIMESTAMP, amount INTEGER NOT NULL, currency TEXT, description TEXT, category_id INTEGER NOT NULL, expenses_table_id INTEGER NOT NULL, " +
			"FOREIGN KEY (expenses_table_id) REFERENCES expenses_tables (id), FOREIGN KEY (category_id) REFERENCES expense_categories (id));"

		return this.db.execute(sql)
	}

	async byGroup(group = REPORT_GROUPS.DAY, where = null) {
		const dto = new DBDto()
		dto.from = " FROM expenses as e "

		switch (group) {
			case REPORT_GROUPS.TAG:
				dto.select =
					"SELECT DISTINCT t.id as tag_id,t.title as tag_title, SUM(amount) as amount,DATE(e.created_at, 'unixepoch') as date, category_id, currency"
				dto.join =
				"LEFT JOIN expense_tags as et on et.expense_id = e.id LEFT JOIN tags as t on t.id = et.tag_id"
				dto.group = " GROUP BY tag_id, category_id, currency"
				break
			case REPORT_GROUPS.DAY:
				dto.group = " GROUP BY date, category_id, currency"
				dto.select =
					"SELECT DISTINCT DATE(e.created_at, 'unixepoch') as date, SUM(amount) AS amount, category_id, currency"
				break

			default:
				dto.join =
					"LEFT JOIN expense_tags as et on et.expense_id = e.id LEFT JOIN tags as t on t.id = et.tag_id"
				dto.group = " GROUP BY e.id, date, category_id, currency, description"
				dto.select =
					"SELECT DISTINCT e.id as id, DATE(e.created_at, 'unixepoch') as date, amount, category_id, currency, description, GROUP_CONCAT(t.title) AS tags"
				dto.order = " ORDER BY e.id DESC "
				break
		}

		if (where.from && where.to) {
			dto.where =
				" WHERE date BETWEEN DATE(" +
				where.to.format("X") +
				", 'unixepoch') AND  DATE(" +
				where.from.format("X") +
				", 'unixepoch')"
		}

		return this.db.execute(dto.selectSqlStatement())
	}
}
