<template>
  <div>
    <Row>
      <i-col :lg="12" offset="6" :style="{marginTop: '50px'}">
        <Card>
          <p slot="title">
              数据添加
          </p>
          <div style="text-align:center">
            姓名：<i-input size="large" placeholder="姓名" style="width: 220px"v-model="student.name"></i-input>
            性别：<i-input size="large" placeholder="性别" style="width: 220px" v-model="student.sex"></i-input>
            年龄：<i-input size="large" placeholder="年龄" style="width: 220px" v-model="student.age"></i-input>
            <i-button type="info" @click="add_data">添加</i-button>
          </div>
        </Card>

        <Card style="margin-top: 60px">
          <p slot="title">
            数据展示
          </p>
          <el-table
            :data="values"
            style="width: 100%">
            <el-table-column
              label="ID"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="性别"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.sex }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="年龄"
              width="180">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.age }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="init_form(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="remove_data(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </Card>
      </i-col>
    </Row>
    <el-dialog
        title="编辑"
        :visible.sync="editDialogVisible"
        width="30%"
        center>
        姓名：<el-input placeholder="编辑姓名" v-model="upstu.name"></el-input>
        性别：<el-input placeholder="编辑性别" v-model="upstu.sex"></el-input>
        年龄：<el-input placeholder="编辑年龄" v-model="upstu.age"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update_date">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export  default {
    name: 'index',
    data() {
      return {
        student: {
          id: '',
          name: '',
          sex: '',
          age: ''
        },
        upstu: {
          id: '',
          name: '',
          sex: '',
          age: ''
        },
        editDialogVisible:false,
        db: '',
        deleteid: '',
        self: this,
        values: [
        ]
      }
    },
    created () {
      this.create_websql()
      this.get_data()
    },
    methods: {
      create_websql: function () {
        //创建名为mydb的数据库             版本    描述      大小
          this.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        //创建一个名为STUDENT的表,如果存在则不会创建
          this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENT (id unique, name, sex, age)');
            tx.executeSql('INSERT INTO STUDENT (id, name, sex, age) VALUES (?, ?, ?, ?)',[1522813443000,'苏雨', '男', 20]);
            tx.executeSql('INSERT INTO STUDENT (id, name, sex, age) VALUES (?, ?, ?, ?)',[1522813443001,'苏苏', '女', 18]);
          });
      },
      //向student表中动态添加一条数据  这个操作跟我们平常的操作数据库一样
      add_data: function () {
        let timestamp = Date.parse(new Date());
        console.log(timestamp)
        let name = this.student.name
        let sex = this.student.sex
        let age = this.student.age
        this.db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENT (id unique, name, sex, age)');//id好像不能重复重复插不进去
          tx.executeSql('INSERT INTO STUDENT (id, name, sex, age) VALUES (?, ?, ?, ?)',[timestamp,name, sex, age]);
        })//添加完之后 重写查询一边websql 使得数据同步
        this.get_data()
        //清空input框中的值
        this.student.age = ''
        this.student.sex = ''
        this.student.name = ''
      },//查询数据
      get_data: function() {
        var arry = new Array()
        this.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM STUDENT', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++){//把查出来的数据封装到一个对象里面 最后放到数组里面
              let name = results.rows.item(i).name
              let sex =  results.rows.item(i).sex
              let age =  results.rows.item(i).age
              let id =  results.rows.item(i).id
              var o = new Object()
              o.name = name
              o.age = age
              o.id = id
              o.sex = sex
              arry.push(o)
            }
          }, null);
        });//将数组赋值给vue创建的数组
        this.values = arry
      },//动态删除表中的一条数据
      remove_data: function (index,row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.db.transaction(function(tx) {
            tx.executeSql('DELETE FROM STUDENT WHERE id = ?',[row.id]);
          })
          this.get_data()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      init_form: function (index,row) {
        this.editDialogVisible = true;
        this.upstu.name = row.name
        this.upstu.sex = row.sex
        this.upstu.age = row.age
        this.upstu.id = row.id
      },
      update_date: function () {
        let name = this.upstu.name
        let sex = this.upstu.sex
        let age = this.upstu.age
        let id = this.upstu.id
        this.db.transaction(function (tx) {
          tx.executeSql('UPDATE STUDENT SET name = ?,sex = ?,age=? WHERE id=?',[name,sex,age,id]);
        })//动态获取数据
        this.get_data()
        this.editDialogVisible = false
      }
    }
  }
</script>

<style scoped>
  .el-input{
    margin:10px auto;
  }
</style>
