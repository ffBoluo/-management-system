<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="4">
        <!-- 搜索行 -->
        <el-col :span="8">
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchUser"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="isDig = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息区 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 作用域插槽 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 操作按钮 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editChange(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="open(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色按钮-->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用戶弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isDig"
      width="50%"
      @close="addDigClose"
    >
      <!-- 表单验证 -->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDig = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">添加</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDige"
      width="50%"
      @close="editDigeClosed"
    >
      <el-form
        :model="editUser"
        :rules="editrules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDige = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校表单验规则
    var checkEamil = (rule, value, callback) => {
      // 手机号正则表达式
      const regPh = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regPh.test(value)) {
        return callback();
      }
      callback(new error("请输入合法邮箱"));
    };
    return {
      // 查询信息
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示几条信息
        pagesize: 2,
      },
      // 用户列表
      userList: [],
      total: 0,
      // 开关弹窗
      isDig: false,
      // 添加用户
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 验证规则
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 ~ 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEamil, trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请输入手机", trigger: "blur" }],
      },
      // 编辑验证规则
      editrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEamil, trigger: "blur" },
        ],
        mobile: [{ required: true, message: "请输入手机", trigger: "blur" }],
      },

      // 编辑弹窗
      editDige: false,
      // 编辑用户信息
      editUser: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("错误");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听页数改变
    handleSizeChange(num) {
      this.queryInfo.pagenum = num;
      this.getUserList();
    },
    // 监听每页显示信息条数
    handleCurrentChange(num) {
      this.queryInfo.pagesize = num;
      this.getUserList();
    },
    // 监听用户权限状态
    async userStateChange(n) {
      const { data: res } = await this.$http.put(
        `/users/${n.id}/state/${n.mg_state}`
      );
      if (res.meta.status !== 200) {
        n.mg_state = !n.mg_state;
        this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    // 查询用户
    searchUser() {
      this.getUserList();
    },
    // 点击开关弹窗
    dialogVisible() {
      this.isDig = !this.isDig;
    },
    // 点击关闭重置表单
    addDigClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 添加用户预校验后发送
    addUsers() {
      this.$refs.ruleForm.validate(async (vaild) => {
        // 校验失败
        if (!vaild) return;
        // 成功则发起请求
        const { data: res } = await this.$http.post("/users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.isDig = false;
        this.$message.success("添加用户成功");
        this.getUserList();
      });
    },
    // 点击获取id编辑用户
    async editChange(n) {
      this.editDige = true;
      const { data: res } = await this.$http.get("/users/" + n);
      this.editUser = res.data;
    },
    // 关闭表单重置
    editDigeClosed() {
      this.$refs.editForm.resetFields();
    },
    // 修改用户信息
    editUserInfo() {
      this.$refs.editForm.validate(async (vaild) => {
        if (!vaild) return this.$message.error("修改失败");
        const { data: res } = await this.$http.put(
          "/users/" + this.editUser.id,
          {
            email: this.editUser.email,
            mobile: this.editUser.mobile,
          }
        );
        this.editDige = false;
        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.$message.success("修改失败");
        this.getUserList();
      });
    },
    // 根据id删除用户
    open(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("/users/" + id);
          if (res.meta.status !== 200) return reject("删除失败");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getUserList();
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: err ? "删除失败" : "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  margin-right: 100px;
}
</style>