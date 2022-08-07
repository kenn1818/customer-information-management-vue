<template>
  <div class="row">
    <div class="col-md-12">
      <card>
        <div slot="header">
          <h5 class="title">
            <n-button
              class="btn btn-primary btn-sm mb-6"
              type="info"
              @click.native="backPage()"
              round
              icon
              style="margin-bottom: 15px"
            >
              <i class="now-ui-icons arrows-1_minimal-left"></i>
            </n-button>
            {{$route.name.toUpperCase()}}
          </h5>
        </div>
        <form>
          <div class="row">
            <label
              class="col-md-2 col-form-label offset-md-3 text-right"
            >NAME <span class="red">*</span></label>
            <div class="col-md-3">
              <fg-input type="text" v-model="customer.name"></fg-input>
            </div>
          </div>

          <div class="row">
            <label
              class="col-md-2 col-form-label offset-md-3 text-right"
            >GENDER <span class="red">*</span></label>
            <div class="col-md-3">
              <el-select
                class="select-info"
                size="small"
                placeholder="Select a gender"
                v-model="customer.gender"
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
          </div>

          <div class="row">
            <label
              class="col-md-2 col-form-label offset-md-3 text-right"
            >AGE <span class="red">*</span></label>
            <div class="col-md-3">
              <fg-input type="number" v-model="customer.age"></fg-input>
            </div>
          </div>

          
          <div class="row">
            <div id="btnAdd" class="col-md-6 offset-md-6">
              <n-button
                class="button"
                type="info"
                @click.native="updateCustomer();"
              >UPDATE</n-button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
import swal from "sweetalert2";
import Customer from "src/api/Customer";

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      id: this.$route.params.id,
      alert: "",
      customer: {
        id: this.$route.params.id,
        name: "",
        gender: "",
        age: ""
      },
      genderOption: [{name: "Male"}, {name: "Female"}]
    };
  },
  methods: {
    backPage() {
      this.$router.push("/customer");
    },
    async updateCustomer() {
      if (this.customer.name === "" || this.customer.name === undefined) {
          this.$notify({
            message: "Name cannot be empty",
            icon: "now-ui-icons travel_info",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger"
          })
          swal({
            title: `Name cannot be empty`,
            buttonsStyling: false,
            type: "error",
            confirmButtonClass: "btn btn-success btn-fill"
          })
      }

      else if (this.customer.gender === "" || this.customer.gender === undefined) {
          this.$notify({
            message: "Gender cannot be empty",
            icon: "now-ui-icons travel_info",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger"
          })
          swal({
            title: `Gender cannot be empty`,
            buttonsStyling: false,
            type: "error",
            confirmButtonClass: "btn btn-success btn-fill"
          })
      }

      else if (this.customer.age === "" || this.customer.age === undefined) {
          this.$notify({
            message: "Age cannot be empty",
            icon: "now-ui-icons travel_info",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger"
          })
          swal({
            title: `Age cannot be empty`,
            buttonsStyling: false,
            type: "error",
            confirmButtonClass: "btn btn-success btn-fill"
          })
      }
      else {
        try {
            await Customer.updateCustomer(
            this.customer
            );
            swal({
            title: `You updated ${this.customer.name.trim()}`,
            buttonsStyling: false,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            onClose: () => {
                this.$router.push(`/customer`);
            }
            });
        } catch (err) {
            this.$notify({
                message: err.code,
                icon: "now-ui-icons travel_info",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "danger"
            })
            swal({
              title: err.code,
              buttonsStyling: false,
              type: "error",
              confirmButtonClass: "btn btn-success btn-fill"
            })
        }
      }
    }
  },
  async created() {
    try {
      this.customer = await Customer.getCustomerById(this.$route.params.id);  
    } catch (err) {
      this.error = err.message;
    }
  }
};
</script>
<style scoped>
.red{
  color: red
}
</style>
