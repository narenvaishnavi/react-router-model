import React from "react";
import { Button, Col, Table, Spin, Alert, Input, Icon, Tooltip } from 'antd';
import scienaptic from '../../src/scienaptic.png';
import Hp from '../../src/Hp.png';
import Highlighter from 'react-highlight-words';
import _ from 'lodash';
import axios from "axios";

// let data = [];

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataRecieved: false,
            listData: [],
            selectedRowKeys: [],
            loading: false
        }
    }

    componentDidMount() {
        axios.post('http://scienaptic.mockable.io/hpData')
            .then(response => {
                // let groupData = response.data;
                let ID = _.uniq(_.map(response.data, 'New_Location_ID'));
                let name = _.uniq(_.map(response.data, 'Seller_Name_Data_Feed'));
                let DBA = _.uniq(_.map(response.data, 'DBA'));
                let type = _.uniq(_.map(response.data, 'Product_Line'));
                let map = _.uniq(_.map(response.data, 'MAP'));
                // Dummy value
                let Report_Week_Start_Date = (_.map(response.data, 'Report_Week_Start_Date'));
                let Lowest_Possible_Price = _.uniq(_.map(response.data, 'Lowest_Possible_Price'));
                let impact = _.uniq(_.map(response.data, 'Lowest_Possible_Price'));
                let Listing_Date = _.uniq(_.map(response.data, 'Listing_Date'));
                let list = [];
                impact.map((data) => {
                   let round = data/12;
                   list.push(round.toFixed(2));
                })
                // var grouped = _.mapValues(_.groupBy(response.data, 'New_Location_ID'),
                //     clist => clist.map(groupData => _.omit(groupData, 'New_Location_ID')));

                let dataKey = [];
                console.log(dataKey);
                for(let i =0; i<ID.length;i++){
                    dataKey.push({
                        key:ID[i],
                        New_Location_ID: ID[i],
                        Seller_Name_Unified: name[i],
                        DBA: DBA[i],
                        Product_Line: type[i],
                        MAP: map[i],
                        Report_Week_Start_Date: Report_Week_Start_Date[i],
                        Lowest_Possible_Price: Lowest_Possible_Price[i],
                        impact:list[i],
                        Listing_Date:Listing_Date[i]
                    });
                }
                console.log(dataKey);
                this.setState({
                    data: dataKey,
                    dataRecieved: true
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    // click = () => {
    //     this.props.history.push('/');
    // }
    start = () => {
        this.setState({ loading: false });
        console.log(this.state.selectedRowKeys);
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    // check = (event) => {
    //     if (event.currentTarget.checked) {
    //         data.push(event.currentTarget.id);
    //     }
    //     else {
    //         let index;
    //         index = data.indexOf(event.currentTarget.id);
    //         data.splice(index, 1);
    //     }
    //     this.setState({
    //         listData: data
    //     })
    // }
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
    render() {
        console.log(this.state.listData);
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        // const hasSelected = selectedRowKeys.length > 0;

        // const rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     data = selectedRows;
        //     },
        //     getCheckboxProps: record => ({
        //       disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //       name: record.name,
        //     }),
        //   };

        let columns = [
            {
                title: 'Location ID',
                dataIndex: 'New_Location_ID',
                key: 'New_Location_ID',
                // width: 120,
                ...this.getColumnSearchProps('New_Location_ID'),
            },
            {
                title: 'Seller Name Unified',
                dataIndex: 'Seller_Name_Unified',
                key: 'Seller_Name_Unified',
                // width: 160,
                ...this.getColumnSearchProps('Seller_Name_Unified'),
            },
            {
                title: 'Seller DBA',
                dataIndex: 'DBA',
                key: 'DBA',
                ...this.getColumnSearchProps('DBA'),
            },
            {
                title: 'Product Type',
                dataIndex: 'Product_Line',
                key: 'Product_Line',
                // ...this.getColumnSearchProps('Product_Line'),
            },
            {
                title: 'MAP',
                dataIndex: 'MAP',
                key: 'MAP',
                // ...this.getColumnSearchProps('MAP'),
            },
            {
                title: 'Warning Delivered Date',
                dataIndex: 'Report_Week_Start_Date',
                key: 'Report_Week_Start_Date',
            },
            {
                title: 'Eligibility Start Date',
                dataIndex: 'Report_Week_Start_Date',
                key: 'Report_Week_Start_Date',
            },
            {
                title: 'Annual Revenue ($)',
                dataIndex: 'Lowest_Possible_Price',
                key: 'Lowest_Possible_Price',
            },
            {
                title: 'Product Suspension Impact',
                dataIndex: 'impact',
                key: 'impact',
            },
            {
                title: 'Last Collected Date',
                dataIndex: 'Listing_Date',
                key: 'Listing_Date',
            },
            // {
            //     title: 'Select',
            //     key: 'select',
            //     render: (text, record) => (
            //       <span>
            //         <Checkbox id={record.New_Location_ID} onClick={this.check}></Checkbox>
            //       </span>
            //     ),
            //   },
        ];
        return this.state.dataRecieved === true ? (
        <div>
             <Col span={24}>
                <Col span={1}></Col>
                <Col span={10} style={{ marginTop: "1%", marginBottom: "1%" }}><img src={Hp} style={{ width: "4em" }} alt="Hp logo"/><span style={{ color: "#0095d9", fontWeight: 500, fontSize: "16px", marginLeft: "2%" }}>Visual Inspector</span></Col>
                <Col span={10}></Col>
                <Col span={3} style={{ marginTop: "2%", fontSize: "24px", color: "#0095d9" }}><Tooltip placement="right" title="Logout!"><Icon type="logout"  onClick={this.logout}></Icon></Tooltip></Col>
             </Col>
            <div style={{ border: "25px solid #ffffff" }}>
                <div><Col span={24}><Table bordered columns={columns} dataSource={this.state.data} rowSelection={rowSelection} pagination={true} /></Col></div>
                <Col span={24}>
                    <Col span={3}><Button className="hp" style={{ width: "60%", float: "right" }} onClick={this.start} loading={loading}> Send </Button></Col>
                    <Col span={21}></Col>
                </Col>
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

export default Admin;