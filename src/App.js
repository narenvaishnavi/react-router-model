import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import jsonData from '../src/VisualInspectionSample.json';
import Admin from '../src/view/admin';
import Login from '../src/view/login';
import { Button, Col, Table, Spin, Alert, Icon, Input, Tooltip, Modal, Layout } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from "axios";
import 'antd/dist/antd.css';
import './App.css';
import scienaptic from '../src/scienaptic.png';
import Hp from '../src/Hp.png';

const { Header } = Layout;

let dataKey = [];
const ButtonGroup = Button.Group;
let url = '', columns, urlData, Aprice, Lprice, map, sku, notes = '', violation_id, counter, flag = false;

class ModalSwitch extends Component {

  previousLocation = this.props.location;

  constructor(props) {
    super(props);
    this.state = {
      spin: false
    }
  }

  componentWillUpdate(nextProps) {
    let { location } = this.props;

    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );

    return (
      <div location={isModal ? this.previousLocation : location} style={{ overflow: "auto" }}>
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route path="/frame/:id" component={frame} />
            <Route exact path="/admin" component={Admin} />
            <Route path="/snapshot/:id" component={Home} />
          </Switch>
          {isModal ? <Route path="/snapshot/:id" component={ModalPage} /> : null}
        </div>
      </div>
    );
  }
}



class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: [],
      hasMoreItems: true,
      dataRecieved: false,
      searchText: ''
    }
  }
  componentDidMount() {
    axios.post('http://scienaptic.mockable.io/hpData')
      .then(response => {
        response.data.map((data, i) => {
          dataKey.push({
            key: i + 1,
            Violation_ID: data.Violation_ID,
            DBA: data.DBA,
            SKU: data.SKU,
            Product_Line: data.Product_Line,
            Listing_Date: data.Listing_Date,
            Lowest_Possible_Price: data.Lowest_Possible_Price,
            Seller_Advertised_Price: data.Seller_Advertised_Price,
            MAP: data.MAP,
            Eligible_IR_Amount: data.Eligible_IR_Amount,
            Violation_Code: data.Violation_Code,
            Notes: data.Notes
          });
          return dataKey;
        })
        this.setState({
          jsonData: dataKey,
          dataRecieved: true
        })

        urlData = response.data;
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  logout = () => {
    this.props.history.push('/');
  }

  galleryClick = (event) => {
    urlData.map((data, i) => {
      if (parseInt(event.currentTarget.id) === data.Violation_ID) {
        url = data.Screenshot_URL;
        violation_id = data.Violation_ID;
        Aprice = data.Seller_Advertised_Price;
        Lprice = data.Lowest_Possible_Price;
        map = data.MAP;
        notes = data.Notes;
        sku = data.SKU;
      }
      return data;
    })
    this.props.history.push('/frame/' + violation_id)

  }

  render() {
    let rowIndex = (record) => {
      console.log(dataKey);
      let index = dataKey.indexOf(record);
      counter = index + 1;
    }

    columns = [
      {
        title: 'Violation ID',
        dataIndex: 'Violation_ID',
        key: 'Violation_ID',
        width: 120,
        ...this.getColumnSearchProps('Violation_ID'),
        render: text => <Link to={{
          pathname: `/snapshot/${text}`,
          state: { modal: true }
        }} onClick={this.galleryClick} id={text}>{text}</Link>,
      },
      {
        title: 'DBA',
        dataIndex: 'DBA',
        key: 'DBA',
        width: 160,
        ...this.getColumnSearchProps('DBA'),
      },
      {
        title: 'SKU',
        dataIndex: 'SKU',
        key: 'SKU',
        ...this.getColumnSearchProps('SKU'),
      },
      {
        title: 'Product Line',
        dataIndex: 'Product_Line',
        key: 'Product_Line',
        ...this.getColumnSearchProps('Product_Line'),
      },
      {
        title: 'Listing Date',
        dataIndex: 'Listing_Date',
        key: 'Listing_Date',
        ...this.getColumnSearchProps('Listing_Date'),
      },
      {
        title: 'Lowest Possible Price ($)',
        dataIndex: 'Lowest_Possible_Price',
        key: 'Lowest_Possible_Price',
        // ...this.getColumnSearchProps('Lowest_Possible_Price'),
      },
      {
        title: 'Seller Advertised Price ($)',
        dataIndex: 'Seller_Advertised_Price',
        key: '  Seller_Advertised_Price',
        // ...this.getColumnSearchProps('Seller_Advertised_Price'),
      },
      {
        title: 'MAP',
        dataIndex: 'MAP',
        key: 'MAP',
        // ...this.getColumnSearchProps('MAP'),
      },
      {
        title: 'Eligible IR Amount',
        dataIndex: 'Eligible_IR_Amount',
        key: 'Eligible_IR_Amount',
      },
      {
        title: 'Violation Code',
        dataIndex: 'Violation_Code',
        key: 'Violation_Code',
        width: 100,
        ...this.getColumnSearchProps('Violation_Code'),
      },
      {
        title: 'Notes',
        dataIndex: 'Notes',
        key: 'Notes',
        width: 200,
        // ...this.getColumnSearchProps('Notes'),
      }
    ];
    return this.state.dataRecieved === true ? (
      <div>
        {/* <Col span={24}>
          <Col span={1}></Col>
          <Col span={10} style={{  marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}>Visual Inspector</span></Col>
          <Col span={10}></Col>
          <Col span={3}><Tooltip placement="right" title="Logout!"><Icon style={{fontSize: "24px", color: "#0095d9" }} type="logout" onClick={this.logout}></Icon></Tooltip></Col>
        </Col> */}
        <Col span={24}>
          <Col span={1}></Col>
          <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo" /><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}>Visual Inspector</span></Col>
          <Col span={10}></Col>
          <Col span={3} style={{ marginTop: "2%", fontSize: "24px", color: "#0095d9" }}><Tooltip placement="right" title="Logout!"><Icon type="logout" onClick={this.logout}></Icon></Tooltip></Col>
        </Col>
        <div style={{ border: "25px solid #ffffff" }}>
          <div><Col span={24}><Table bordered columns={columns} onRow={(record) => ({ onClick: () => { rowIndex(record); } })} dataSource={this.state.jsonData} pagination={true} /></Col></div>
          <Col span={24}>
            <Col span={21}></Col>
            <Col span={3} style={{ float: "right" }}>&copy;<img src={scienaptic} alt="Scienaptic logo" style={{ width: "5em" }} /><img src={Hp} alt="Hp logo" style={{ width: "2em" }} /></Col>
          </Col>
        </div>
      </div>
    ) : (<Col span={24}>
      <Col span={8}></Col>
      <Col span={9} style={{ marginTop: "12%" }}>
        <Spin size="large">
          <Alert
            message="Loading..."
            description="Please wait while we load Data."
            type="info"
          />
        </Spin>
      </Col>
      <Col span={5}></Col>
    </Col>);
  }

}

class frame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: url,
      advertisedPrice: Aprice,
      lowestPrice: Lprice,
      map: map,
      id: violation_id,
      notes: notes,
      previous: true,
      next: false
    }
  }

  close = e => {
    this.props.history.push('/home');
  }

  report = () => {
    if (violation_id.length !== 0)
      console.log(violation_id);
    else
      console.log(this.state.id);
  }

  previous = () => {
    --counter;
    if (flag === false) {
      flag = true;
      --counter;
    }
    if (counter === 0 || counter === -1) {
      this.setState({
        previous: true
      })
    }
    url = ''; map = ''; Aprice = ''; Lprice = ''; violation_id = ''; notes = ''; sku = '';
    console.log(urlData.length);
    if (counter <= urlData.length && counter !== -1) {
      let keys = Object.keys(urlData[counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");

      // Get the details of the previous 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      // counter--;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        next: false
      })
    }
    else {
      this.setState({
        previous: true
      })
    }

  };
  next = () => {
    url = ''; map = ''; Aprice = ''; Lprice = ''; violation_id = ''; notes = ''; sku = '';
    console.log(urlData.length);
    if (flag === true) {
      flag = false;
      if (counter === 0) {
        counter = 1;
      }
      else
        counter += 1;
    }
    if (counter === -1 || counter === 0) {
      counter = 1;
    }
    else if (counter < urlData.length) {
      let keys = Object.keys(urlData[counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");
      let index5 = keys.indexOf("SKU");
      let index6 = keys.indexOf("Notes");

      // Get the details of the next 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let sku = keys[index5];
      let note = keys[index6];

      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      let sku_val = urlData[counter][sku];
      let note_val = urlData[counter][note];
      ++counter;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        sku: sku_val,
        notes: note_val,
        previous: false,
        newNote: ''
      })
    }
    else {
      let keys = Object.keys(urlData[--counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");
      let index5 = keys.indexOf("SKU");
      let index6 = keys.indexOf("Notes");

      // Get the details of the next 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let sku = keys[index5];
      let note = keys[index6];

      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      let sku_val = urlData[counter][sku];
      let note_val = urlData[counter][note];
      ++counter;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        sku: sku_val,
        notes: note_val,
        previous: false,
        next: true,
        newNote: ''
      })
    }

  };
  render() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          // background: "rgba(0, 0, 0, 0.15)"
        }}
      >
        <div
          style={{
            position: "absolute",
            background: "#fff",
            top: 5,
            left: "2%",
            right: "2%",
            padding: 15,
            // border: "2px solid #444"
          }}
        >
          <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
              <Col span={24}>
                <Col span={1}></Col>
                <Col span={4}><p className="price">Violation ID: {this.state.id}</p></Col>
                <Col span={1}></Col>
                <Col span={5}><p className="price">Seller Advertised Price ($): {this.state.advertisedPrice}</p></Col>
                <Col span={1}></Col>
                <Col span={5}><p className="price">Lowest Possible Price ($): {this.state.lowestPrice}</p></Col>
                <Col span={1}></Col>
                <Col span={3}><p className="price">MAP ($): {this.state.map}</p></Col>
                <Col span={1}></Col>
                <Col span={2}><p className="price">SKU: {this.state.sku}</p></Col>
              </Col>
            </Header>
          </Layout>,
          <div className="header">
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={4}><p className="price">Violation ID: {this.state.id}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Seller Advertised Price ($): {this.state.advertisedPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Lowest Possible Price ($): {this.state.lowestPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={3}><p className="price">MAP ($): {this.state.map}</p></Col>
              <Col span={1}></Col>
              <Col span={2}><p className="price">SKU: {this.state.sku}</p></Col>
            </Col>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={10}><p className="price">Notes: {this.state.notes}</p></Col>
              <Col span={3}></Col>
              <Col span={7}></Col>
              <Col span={3}><Button className="report" onClick={this.report}>Report</Button></Col>
            </Col>
          </div>
          <Col span={24}>
            <iframe
              title="Modal Embed"
              className="iframeAlign"
              src={url.length !== 0 ? url : this.state.url}
              allowFullScreen
            />
          </Col>
          <Col span={24}>
            {/* <Col span={2}>
            <Button className="hp" onClick={this.previous} style={{ float: "right" }} disabled={this.state.previous}>
                Previous
                </Button>
            </Col>
            <Col span={2}>
              <Button className="hp" onClick={this.next} style={{ float: "right" }}>
                Next
                </Button>
            </Col> */}
            <Col span={8}>
              <ButtonGroup className="nextPrev">
                <Button onClick={this.previous} disabled={this.state.previous}>
                  <Icon type="left" />
                  Previous
                </Button>
                <Button onClick={this.next} disabled={this.state.next}>
                  Next
                  <Icon type="right" />
                </Button>
              </ButtonGroup>
            </Col>

            <Col span={14}></Col>
            <Col span={2}>
              <Button className="hp" onClick={this.close} style={{ float: "right" }}>
                Close
                  </Button>
            </Col>
          </Col>
        </div>
      </div>
    )
  }
}

class ModalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      advertisedPrice: '',
      lowestPrice: '',
      map: '',
      id: '',
      notes: '',
      previous: true,
      next: false,
      visible: false,
      newNote: ''
    }
  }

  shouldComponentUpdate() {
    return true;
  }
  close = e => {
    this.props.history.push('/home');
  }

  handleCancel = (event) => {
    this.setState({
      visible: false
    })
  }

  report = () => {
    //alert(' It was reported to me!');
    console.log(this.state.newNote);
    let new_id = violation_id !== '' ? violation_id : this.state.id;
    console.log(new_id);
    if (this.state.newNote !== "")
      this.setState({
        visible: false
      })
  }

  saveText = (event) => {
    let note = event.currentTarget.value;
    this.setState({
      newNote: note
    })
  }

  handleKeyUp = (event) => {
    if (event.keyCode === parseInt('13')) {
      if (this.state.newNote.indexOf(' ') === -1 && this.state.newNote.length !== 1) {
        alert('space');
        this.setState({
          visible: false
        })
      }
      else {
        event.preventDefault();
        this.report();
      }
    }
  }

  reject = () => {
    if (violation_id.length !== "") {
      this.setState({
        visible: true
      })
      console.log(violation_id);
    }
    else
      console.log(this.state.id);
  }

  approve = () => {
    if (violation_id.length !== 0)
      console.log(violation_id);
    else
      console.log(this.state.id);
    this.next();
  }

  previous = () => {
    --counter;
    if (flag === false) {
      flag = true;
      --counter;
    }
    if (counter === 0 || counter === -1) {
      this.setState({
        previous: true
      })
    }
    url = ''; map = ''; Aprice = ''; Lprice = ''; violation_id = ''; notes = ''; sku = '';
    console.log(urlData.length);
    if (counter <= urlData.length && counter !== -1) {
      let keys = Object.keys(urlData[counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");

      // Get the details of the next 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      // counter--;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        next: false,
        newNote: ''
      })
    }
    else {
      this.setState({
        previous: true,
        newNote: ''
      })
    }

  };
  next = () => {
    url = ''; map = ''; Aprice = ''; Lprice = ''; violation_id = ''; notes = ''; sku = '';
    console.log(urlData.length);
    if (flag === true) {
      flag = false;
      if (counter === 0) {
        counter = 1;
      }
      else
        counter += 1;
    }
    if (counter === -1 || counter === 0) {
      counter = 1;
    }
    else if (counter < urlData.length) {
      let keys = Object.keys(urlData[counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");
      let index5 = keys.indexOf("SKU");
      let index6 = keys.indexOf("Notes");

      // Get the details of the next 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let sku = keys[index5];
      let note = keys[index6];

      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      let sku_val = urlData[counter][sku];
      let note_val = urlData[counter][note];
      ++counter;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        sku: sku_val,
        notes: note_val,
        previous: false,
        newNote: ''
      })
    }
    else {
      let keys = Object.keys(urlData[--counter]);
      let index = keys.indexOf("Screenshot_URL");
      let index1 = keys.indexOf("Seller_Advertised_Price");
      let index2 = keys.indexOf("Lowest_Possible_Price");
      let index3 = keys.indexOf("MAP");
      let index4 = keys.indexOf("Violation_ID");
      let index5 = keys.indexOf("SKU");
      let index6 = keys.indexOf("Notes");

      // Get the details of the next 
      let snapshot = keys[index];
      let aprice = keys[index1];
      let lprice = keys[index2];
      let map = keys[index3];
      let id = keys[index4];
      let sku = keys[index5];
      let note = keys[index6];

      let snapshotURL = urlData[counter][snapshot];
      let advPrice = urlData[counter][aprice];
      let lowPrice = urlData[counter][lprice];
      let mapPrice = urlData[counter][map];
      let V_ID = urlData[counter][id];
      let sku_val = urlData[counter][sku];
      let note_val = urlData[counter][note];
      ++counter;
      this.setState({
        url: snapshotURL,
        advertisedPrice: advPrice,
        lowestPrice: lowPrice,
        map: mapPrice,
        id: V_ID,
        sku: sku_val,
        notes: note_val,
        previous: false,
        next: true,
        newNote: ''
      })
    }

  };
  render() {
    const { TextArea } = Input;
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          height: "59em",
          background: "rgba(0, 0, 0, 0.15)"
        }}
      >
        <div
          style={{
            position: "absolute",
            background: "#fff",
            // top: 2,
            left: "2%",
            right: "2%",
            padding: 15,
            //height: "55.8em",
            height: "59em",
            border: "1px solid transparent"
          }}
        >
          <Modal
            key="violaion"
            visible={this.state.visible}
            closable={false}
            footer={[
              <Button className="cancel" onClick={this.handleCancel}>
                Close
            </Button>,
              <Button className="save" onClick={this.report}>
                Report
            </Button>,
            ]}
          >
            <div>
              {/* <h3 style={{ color: "#0095d9" }}>Reject Violation</h3> */}
              <label style={{ color: "#0095d9" }}>Notes:</label>
              <form>
                <TextArea rows={4} placeholder="Please type your notes here!" value={this.state.newNote} onKeyUp={this.handleKeyUp} onChange={this.saveText} />
              </form>
            </div>
          </Modal>
          <Layout style={{marginTop:"-1.3em"}}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '94%', height:"7em" }}>
              <Col span={24} style={{marginTop:"0em"}}>
              {/* <Col span={1}></Col> */}
              <Col span={4}><p className="price">Violation ID: {violation_id.length !== 0 ? violation_id : this.state.id}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Seller Advertised Price ($): {Aprice.length !== 0 ? Aprice : this.state.advertisedPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Lowest Possible Price ($): {Lprice.length !== 0 ? Lprice : this.state.lowestPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={3}><p className="price">MAP ($): {map.length !== 0 ? map : this.state.map}</p></Col>
              <Col span={1}></Col>
              <Col span={3}><p className="price">SKU: {sku.length !== 0 ? sku : this.state.sku}</p></Col>
              </Col>
              <Col span={24} style={{marginTop:"-3em"}}>
              {/* <Col span={1}></Col> */}
              <Col span={10}><p className="price">Notes: {notes.length !== 0 ? notes : this.state.notes}</p></Col>
              <Col span={3}></Col>
              <Col span={2}></Col>
              <Col span={8}>
                <ButtonGroup className="nextPrev">
                  <Button onClick={this.previous} disabled={this.state.previous}>
                    <Icon style={{ color: "#fff" }} type="step-backward" />
                    {/* Previous */}
                  </Button>
                  <Button onClick={this.next} disabled={this.state.next}>
                    {/* Next */}
                    <Icon style={{ color: "#fff" }} type="step-forward" />
                  </Button>
                </ButtonGroup>
              </Col>
            </Col>
            </Header>
          </Layout>
          {/* <div className="header">
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={4}><p className="price">Violation ID: {violation_id.length !== 0 ? violation_id : this.state.id}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Seller Advertised Price ($): {Aprice.length !== 0 ? Aprice : this.state.advertisedPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={5}><p className="price">Lowest Possible Price ($): {Lprice.length !== 0 ? Lprice : this.state.lowestPrice}</p></Col>
              <Col span={1}></Col>
              <Col span={3}><p className="price">MAP ($): {map.length !== 0 ? map : this.state.map}</p></Col>
              <Col span={1}></Col>
              <Col span={2}><p className="price">SKU: {sku.length !== 0 ? sku : this.state.sku}</p></Col>
            </Col>
            <Col span={24}>
              <Col span={1}></Col>
              <Col span={10}><p className="price">Notes: {notes.length !== 0 ? notes : this.state.notes}</p></Col>
              <Col span={3}></Col>
              <Col span={2}></Col>
              <Col span={8}>
                <ButtonGroup className="nextPrev">
                  <Button onClick={this.previous} disabled={this.state.previous}>
                    <Icon style={{ color: "#fff" }} type="step-backward" />
                  </Button>
                  <Button onClick={this.next} disabled={this.state.next}>
                    <Icon style={{ color: "#fff" }} type="step-forward" />
                  </Button>
                </ButtonGroup>
              </Col>
            </Col>
          </div> */}
          <Col span={24} style={{marginTop:"7em"}}>
            <iframe
              title="Modal Embed"
              className="iframeAlign"
              src={url.length !== 0 ? url : this.state.url}
              allowFullScreen
            />
          </Col>
          <Col span={24}>
            <Col span={2}>
              <Button className="hp" onClick={this.close} style={{ float: "right" }}>
                Close
                  </Button>
            </Col>
            <Col span={18}></Col>
            <Col span={4}>
              <Button className="reject" onClick={this.reject}>Reject</Button>
              <Button className="approve" onClick={this.approve}>Approve</Button>
            </Col>
            {/* <Col span={24}>
              <Col span={21}></Col>
              <Col span={3} style={{ float: "right" }}>&copy;<img src={scienaptic} alt="Scienaptic logo" style={{ width: "5em" }} /><img src={Hp} alt="Hp logo" style={{ width: "2em" }} /></Col>
            </Col> */}
          </Col>
        </div>

      </div>
    )
  }
}

function ModalGallery() {
  return (
    <Router>
      <Route component={ModalSwitch} />
    </Router>
  );
}

export default ModalGallery;
