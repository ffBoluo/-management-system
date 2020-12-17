<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 按钮添加分类 -->
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <!-- 树形控件 -->
      <tree-table
        :data="catelist"
        :columns="options"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: lightred"></i>
        </template>
        <!-- 排序 -->
        <template slot="sorte" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="warning"
            >二级</el-tag
          >
          <el-tag v-else type="danger">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类弹框 -->
    <el-dialog title="添加分类" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="addCateForm"
        :rules="addCaterules"
        ref="addruleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options是数据对象 -->
          <!-- props指定配置对象 -->
          <el-cascader
            v-model="selectCate"
            @change="getParentsCates"
            :options="parentsCate"
            clearable
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="additionSort">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询列表信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 总的数据
      total: 0,
      // 商品分类列表信息
      catelist: [],
      // 为table指定列的定义
      options: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        // 自定义插槽是否有效列
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok",
        },
        //  排序
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "sorte",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
        },
      ],
      // 添加分类弹框
      dialogVisible: false,
      // 添加分类数据
      addCateForm: {
        // 分类父id ，如果要添加1级分类，则父分类id应该设置为0
        cat_pid: 0,
        // 添加分类名称
        cat_name: "",
        // 分类等级，默认一级
        cat_level: 0,
      },
      // 2级分类数据
      parentsCate: [],
      // 添加分类验证规则
      addCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 选取分类数组
      selectCate: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表信息
    async getCateList() {
      const { data: res } = await this.$http.get("/categories", {
        params: this.queryInfo,
      });
      this.catelist = res.data.result;
      this.total = res.data.total;
      // console.log(res.data);
    },
    // 监听每页显示几条数据
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    // 监听页码数
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getCateList();
    },
    // 添加分类
    addCategory() {
      this.dialogVisible = true;
      this.getParentsCategorys();
    },
    async getParentsCategorys() {
      const { data: res } = await this.$http.get("categories", { type: 1 });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级列表失败");
      this.parentsCate = res.data;
    },
    // 级联选择器选中的id
    getParentsCates() {
      if (this.selectCate.length > 0) {
        this.addCateForm.cat_pid = this.selectCate[this.selectCate.length - 1];
        this.addCateForm.cat_level = this.selectCate.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    additionSort() {
      // console.log(this.addCateForm);
      this.$refs.addruleForm.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post(
          "/categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.dialogVisible = false;
        this.$message.success("添加分类成功");
        this.getCateList();
      });
    },
  },
};
</script>

<style>
.el-cascader {
  width: 100%;
}
</style>