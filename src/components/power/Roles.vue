<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="isDig = true"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <!-- 表单 -->
      <el-table :data="rolesList" stripe style="width: 100%" border>
        <!-- 权限伸缩行 -->
        <el-table-column type="expand" width="30">
          <template slot-scope="scope">
            <!-- 每行 -->
            <el-row
              v-for="(item1, ind1) in scope.row.children"
              :key="item1.id"
              :class="['botber', ind1 === 0 ? 'topber' : '', 'dcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRoleById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <!-- 箭头 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, ind2) in item1.children"
                  :key="item2.id"
                  :class="[ind2 === 0 ? '' : 'topber', 'dcenter']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRoleById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- pre美化json数据 -->
            <pre>
            {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="280">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="280">
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作按钮 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="roleChange(scope.row.id)"
                >编辑
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
                >删除</el-button
              >
            </el-tooltip>

            <!-- 分配角色按钮-->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetDiaLog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户角色弹窗 -->
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDig = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">添加</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetDeafKet"
    >
      <el-tree
        :data="rightsList"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultKey"
        :props="treeProps"
        ref="treeNode"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户列表
      rolesList: [],
      // 所有权限数据
      rightsList: [],
      // 树形label
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中节点中的id值
      defaultKey: [],
      // 添加用户弹窗
      // 当前点击选择的角色id
      roleId: "",
      isDig: false,
      // 添加用户信息
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 验证规则
      addrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [{ message: "请输入角色描述", trigger: "blur" }],
      },
      // 分配权限弹窗
      dialogVisible: false,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      // console.log(res.data);
    },
    // 关闭弹窗触发重置表单
    addDigClose() {
      this.$refs.ruleForm.resetFields();
    },
    // 添加角色信息
    addRoles() {
      this.$refs.ruleForm.validate(async (vaild) => {
        if (!vaild) return this.$message.error("输入格式有问题");
        const { data: res } = await this.$http.post("/roles", this.addForm);
        if (res.meta.status !== 201) this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.isDig = false;
        this.getRolesList();
      });
    },
    // 角色编辑
    roleChange(id) {},
    // 弹窗删除权限
    async removeRoleById(role, rightId) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("取消删除");
      const { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      console.log(res.data);
      role.children = res.data;
    },
    // 点击分配权限弹框
    async showSetDiaLog(node) {
      console.log(node.id);
      this.roleId = node.id;
      const { data: res } = await this.$http.get("/rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      console.log(res);
      // 调取递归函数查找权限id
      await this.getRightId(node, this.defaultKey);
      this.rightsList = res.data;
      this.dialogVisible = true;
    },
    // 递归函数查找id
    getRightId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getRightId(item, arr);
      });
    },
    // 关闭权限重置check数组
    resetDeafKet() {
      this.defaultKey.length = 0;
    },
    // 分配权限
    async setRights(role) {
      const arr = [
        ...this.$refs.treeNode.getCheckedKeys(),
        ...this.$refs.treeNode.getHalfCheckedKeys(),
      ];
      const rigstr = arr.join(",");
      console.log(rigstr);
      const { data: res } = await this.$http.post(
        `/roles/${this.roleId}/rights`,
        {
          rids: rigstr,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
.botber {
  border-bottom: 1px solid #ccc;
}
// 顶部边框线
.topber {
  border-top: 1px solid #ccc;
}
// 居中
.dcenter {
  display: flex;
  align-items: center;
}
</style>