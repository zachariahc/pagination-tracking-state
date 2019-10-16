import React, { Component } from 'react'

export class TableRow extends Component {
    render() {
        const { name } = this.props
        return (
            <div>
                {name}
            </div>
        )
    }
}

export default TableRow
