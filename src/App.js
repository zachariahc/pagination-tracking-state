import React from "react";
import "./App.css";
import _ from "lodash";
import fakeData from "./data.js";
let constantArray = [];
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: fakeData,
      currentPage: 1,
      itemsPerPage: 10,
      editedItems: [],
      test: [],
      saveEnabled: true,
      infoMessage: ""
    };
  }

  componentDidMount() {
    const originalItems = [...this.state.items];
    const clone = JSON.parse(JSON.stringify(originalItems));
    constantArray.push(clone);
  }

  handleClick = event => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  };

  changeName = (e, obj) => {
    const result = this.state.items.find(({ _id }) => _id === `${obj.id}`);
    var newData = [...this.state.items];
    result.name = e.target.value;
    this.setState({ newData });
  };
  changeEmail(e, obj) {
    const result = this.state.items.find(({ _id }) => _id === `${obj.id}`);
    var newData = [...this.state.items];
    result.email = e.target.value;
    this.setState({ newData });
  }
  changeCompany(e, obj) {
    const result = this.state.items.find(({ _id }) => _id === `${obj.id}`);
    var newData = [...this.state.items];
    result.company = e.target.value;
    this.setState({ newData });
  }

  findItem = async (e, obj) => {
    const getClass = e.target.getAttribute("class");
    // object id is passed from the event and the find method is used
    const result = this.state.items.find(({ _id }) => _id === `${obj.id}`);
    // copying items in state
    var newData = [...this.state.items];
    // toggling edit flag with boolean
    if (!result.edit) {
      result.edit = true;
      this.setState({ newData });
    } else if (result.edit) {
      result.edit = false;
      this.setState({ newData });
    }

    if (getClass === "fas fa-pen") {
      e.target.setAttribute("class", "fas fa-check");
    } else {
      e.target.setAttribute("class", "fas fa-pen");
      this.saveEdits();
    }
  };

  saveEdits = async () => {
    var objDiff = _.differenceWith(
      this.state.items,
      constantArray[0],
      _.isEqual
    );

    if (objDiff.length !== 0) {
      this.setState({ editedItems: objDiff });
      this.setState({ infoMessage: "State Updated" });
      setTimeout(() => {
        this.setState({ infoMessage: "" });
      }, 3000);
    } else {
      this.setState({ infoMessage: "No Changes Made" });
    }
  };
  // Saving for cancel add edits funcitonality in the future
  cancelSave = () => {
    this.setState({ editedItems: [] });
    console.log(this.state.editedItems);
    /* 
    logic below follows changing global comparision array, might work for resetting changes.
    Can use original array when component mounts?
    */

    // const newOriginalItems = [...constantArray;
    // const clone = JSON.parse(JSON.stringify(newOriginalItems));
    // constantArray.push(clone);
  };

  itemsToSave = () => {
    return this.state.editedItems.map(x => {
      return (
        <p key={x._id}>
          <b>Name: </b> {x.name + " "}
          <b>Contact: </b> {x.email + " "}
          <b>Company: </b> {x.company}
        </p>
      );
    });
  };

  sendEditsToDB = () => {
    this.setState({ editedItems: [], infoMessage: "Edits sent to DB" });
    setTimeout(() => {
      this.setState({ infoMessage: "" });
    }, 3000);

    constantArray = [];
    const newOriginalItems = [...this.state.items];
    const clone = JSON.parse(JSON.stringify(newOriginalItems));
    constantArray.push(clone);
  };
  render() {
    const { items, currentPage, itemsPerPage } = this.state;
    // Logic for displaying page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
    const renderList = currentItems.map((item, index) => {
      return (
        <tr key={index}>
          <td>
            {item.edit === true ? (
              <input
                onChange={e => {
                  this.changeName(e, { id: item._id });
                }}
                value={item.name}
                id="name"
              />
            ) : (
              <span>{item.name}</span>
            )}
          </td>
          <td>
            {item.edit === true ? (
              <input
                name="email"
                onChange={e => {
                  this.changeEmail(e, { id: item._id });
                }}
                value={item.email}
                id={item.email}
              />
            ) : (
              <span>{item.email}</span>
            )}
          </td>
          <td>
            {item.edit === true ? (
              <input
                name="comompany"
                onChange={e => {
                  this.changeCompany(e, { id: item._id });
                }}
                value={item.company}
                id={item.company}
              />
            ) : (
              <span>{item.company}</span>
            )}
            <i
              className="fas fa-pen"
              style={{ float: "right", cursor: "pointer" }}
              onClick={e => this.findItem(e, { id: item._id })}
            ></i>
          </td>
        </tr>
      );
    });
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <p
          className="page-number-click"
          key={number}
          id={number}
          onClick={this.handleClick}
        >
          {number}
        </p>
      );
    });
    return (
      <div className="main-container">
        {this.state.editedItems.length > 0 && (
          <div className="button-container">
            <span className="items-tracker">
              {this.state.editedItems.length}
            </span>
            <span className="save-items">
              <i className="fas fa-save" onClick={this.sendEditsToDB}></i>
            </span>
          </div>
        )}
        <div className="data-table-header">
          <h1>Pagination/State Tracking</h1>
          <p>{this.state.infoMessage}</p>
        </div>

        <table className="table-styles">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>{renderList}</tbody>
        </table>
        <div id="page-numbers">{renderPageNumbers}</div>
        {this.state.editedItems.length > 0 && (
          <div className="data-info">
            <h4>Data to be saved:</h4>
            {this.itemsToSave()}
          </div>
        )}
      </div>
    );
  }
}

export default App;
