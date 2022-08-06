<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <form>
          <div class="row">
            <div class="col-md-4">
              <fg-input type="text" v-model="searchOptions.name" label="Name"></fg-input>
            </div>
            
            <div class="col-md-4">
            <label>Gender </label>
              <el-select
                class="select-info"
                size="small"
                placeholder="Select a gender"
                v-model="searchOptions.gender"
                style="margin-top: -10px; width: 100%;"
              >
                <el-option
                  v-for="option in genderOption"
                  class="select-primary"
                  :value="option.name"
                  :label="option.name"
                  :key="option.name"
                ></el-option>
              </el-select>
            </div>

            <div class="col-md-4">
              <fg-input type="number" v-model="searchOptions.age" label="Age"></fg-input>
            </div>
          </div>

          <div class="row">
            
          </div>
          <hr />
          <!--Filter Button-->
          <div class="row">
            <div class="col-md-12 text-center">
              <n-button
                class="btn btn-primary btn-sm"
                type="info"
                @click.native="searchCustomerData()"
              >FILTER NOW</n-button>
              <n-button @click.native="reset()" class="edit" type="danger" size="sm" round icon>
                <i class="fa fa-repeat"></i>
              </n-button>
            </div>
          </div>
        </form>
      </card>
      <card>
        <div class="col-12 d-flex justify-content-between mb-3">
          <h2 class="title mb-6" style="margin-top:8px">
            {{ $route.name.toUpperCase() }}
            <n-button
              class="btn btn-primary btn-sm mb-6"
              type="success"
              @click.native="handleAdd()"
              round
              icon
              style="margin-bottom: 15px"
            >
              <i class="now-ui-icons ui-1_simple-add"></i>
            </n-button>
          </h2>
          <h3 class="title mb-6" style="margin-top:8px">
            Total Customers: <animated-number :value="total"></animated-number>
          </h3>
        </div>
        <el-table :data="queriedData" highlight-current-row>
          <el-table-column width="100" type="index" align="center"></el-table-column>
          <el-table-column min-width="150" prop="name" label="NAME" align="center"></el-table-column>
          <el-table-column min-width="230" prop="gender" label="GENDER" align="center">
              <div slot-scope="props">
                  <div class="row">
                    <div class="col-md-6 text-right">
                        {{props.row.gender}}
                    </div>
                    <div class="col-md-6 text-left">
                        <n-button
                            class="edit"
                            type="info"
                            size="sm"
                            round
                            icon
                            v-if="props.row.gender === 'Male'"
                        >
                            <i class="fa fa-mars"></i>
                        </n-button>
                        <n-button
                            class="edit"
                            type="danger"
                            size="sm"
                            round
                            icon
                            v-else
                        >
                            <i class="fa fa-venus"></i>
                        </n-button>
                    </div>
                  </div>
              </div>
          </el-table-column>
          <el-table-column min-width="150" prop="age" label="AGE" align="center"></el-table-column>
          <el-table-column min-width="210" prop="createdAt" label="CREATED DATE" align="center"></el-table-column>
          <el-table-column min-width="200" prop="updatedAt" label="UPDATED DATE" align="center"></el-table-column>
          <el-table-column min-width="150" label="ACTION" align="center">
            <div slot-scope="props" class="table-actions">
              <n-button
                @click.native="handleEdit(props.$index, props.row)"
                class="edit"
                type="warning"
                size="sm"
                round
                icon
              >
                <i class="fa fa-pencil"></i>
              </n-button>
              <n-button
                @click.native="handleDelete(props.$index, props.row)"
                class="remove"
                type="danger"
                size="sm"
                round
                icon
              >
                <i class="fa fa-times"></i>
              </n-button>
            </div>
          </el-table-column>
        </el-table>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <div class>
            <p class="card-category">Showing {{from + 1}} to {{to}} of {{total}} entries</p>
          </div>
          <n-pagination
            class="pagination-no-border"
            type="info"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          ></n-pagination>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Radio } from "src/components"
import { Table, TableColumn, Select, Option } from "element-ui"
import { Pagination as NPagination, AnimatedNumber } from "src/components"
import swal from "sweetalert2"
import Customer from "src/api/Customer"
import moment from "moment"

export default {
  components: {
    [Radio.name]: Radio,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    NPagination,
    [Select.name]: Select,
    [Option.name]: Option,
    AnimatedNumber
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.customerData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.customerData.length;
    }
  },
  data() {
    return {
      result: [],
      searchOptions: {
        name: "",
        gender: "",
        age: ""
      },
      genderOption: [{name: "Male"}, {name: "Female"}],
      customerData: [],
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: null
      },
      search: "",
      propsToSearch: ["name"],
      searchedData: [],
      fuseSearch: null,
      value: 1,
    };
  },
  methods: {
    reset() {
      this.searchOptions.name = null
      this.searchOptions.gender = null
      this.searchOptions.age = null
    },
    //Search method
    async searchCustomerData() {

      try {
        let result = await Customer.getCustomerByQueryString(this.searchOptions)
        this.customerData = result;
        for (let key in this.customerData) {
          //Use MomentJS to format date
          this.customerData[key].createdAt = moment.unix(this.customerData[key].createdAt).format("DD/MM/YYYY hh:MM")
          this.customerData[key].updatedAt = moment.unix(this.customerData[key].updatedAt).format("DD/MM/YYYY hh:MM")
        }
      } catch (err) {
        console.log(err);
      }
    },
    //click the button to add new record
    handleAdd() {
      this.$router.push(`/customer/add-customer`);
    },
    //click the icon to edit selected record
    handleEdit(index, row) {
      this.$router.push(`/customer/edit-customer/${row.id}`);
    },
    //click the icon to delete selected record
    async handleDelete(index, row) {
      // console.log(row._id)
      swal({
        title: `Are you sure to delete ${row.name} ?`,
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false
      }).then(async result => {
        if (result.value) {
          await Customer.deleteCustomer(row.id);
          this.searchCustomerData()
          swal({
            title: "Deleted!",
            text: `${row.name} has been deleted.`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false
          });
        } else {
          swal({
            title: "Cancelled",
            text: `${row.name} is not deleted.`,
            type: "error",
            confirmButtonClass: "btn btn-info btn-fill",
            buttonsStyling: false
          });
        }
      });
    }
  },
  //get request when page created
  async created() {
    let result = await Customer.getCustomers()
    this.customerData = result;
    for (let key in this.customerData) {
        //Use MomentJS to format date
        this.customerData[key].createdAt = moment.unix(this.customerData[key].createdAt).format("DD/MM/YYYY hh:MM")
        this.customerData[key].updatedAt = moment.unix(this.customerData[key].updatedAt).format("DD/MM/YYYY hh:MM")
    }
  }
};
</script>
<style scoped>
.display-inline {
  display: inline !important;
}
</style>
