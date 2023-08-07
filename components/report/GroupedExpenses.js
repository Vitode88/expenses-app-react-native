import React, { memo } from "react"
import { ScrollView, View } from "react-native"
import { Cell, Col, Row, Table, TableWrapper } from "react-native-table-component"
import NoData from "../noData/NoData"
import { styles } from "./styles"
import { getArrWidth } from "../../helpers/report"

const GroupedExpenses = ({ data }) => {
	if (data.tableHead.length < 1) {
		return <NoData />
	}

	const arrWidth = getArrWidth(data.tableHead, data.tableData)

	return (
		<ScrollView horizontal>
			<ScrollView>
				<View style={styles.container}>
					<Table style={{ flexDirection: "row" }} borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
						<TableWrapper style={{ width: 90 }}>
							<Cell data={[""]} style={[styles.singleHead]} />
							<Col data={data.tableTitle} style={styles.column} textStyle={[styles.text]} />
						</TableWrapper>

						<TableWrapper style={{ flex: 1 }}>
							<Row
								data={data.tableHead}
								style={[styles.head]}
								widthArr={arrWidth}
								textStyle={styles.text}
							/>
							{data.tableData.map((rowData, index) => (
								<TableWrapper key={index} style={styles.row}>
									{rowData.map((cellData, cellIndex) => (
										<Cell
											key={cellIndex}
											width={arrWidth[cellIndex]}
											data={cellData}
											textStyle={[styles.text]}
										/>
									))}
								</TableWrapper>
							))}
						</TableWrapper>
					</Table>
				</View>
			</ScrollView>
		</ScrollView>
	)
}

export default memo(GroupedExpenses)
