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
                  @click="updata_data(scope.$index, scope.row)">编辑</el-button>
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
      open5(index,row) {
        this.$alert('<div style="text-align: center">姓名：<input type="text" style="margin-bottom: 10px" :value="row.name"/><br>性别：<input type="text" style="margin-bottom: 10px"/><br>年龄：<input type="text"/></div>', '信息修改', {
          dangerouslyUseHTMLString: true
        })
      },
      create_websql: function () {
        //创建名为mydb的数据库             版本    描述      大小
          this.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        //创建一个名为STUDENT的表
          this.db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENT (id unique, name, sex, age)');
          });
      },
      add_data: function () {
        let timestamp = Date.parse(new Date());
        console.log(timestamp)
        let name = this.student.name
        let sex = this.student.sex
        let age = this.student.age
        this.db.transaction(function (tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS STUDENT (id unique, name, sex, age)');//id好像不能重复重复插不进去
          tx.executeSql('INSERT INTO STUDENT (id, name, sex, age) VALUES (?, ?, ?, ?)',[timestamp,name, sex, age]);
        })
        this.get_data()
      },
      get_data: function() {
        var arry = new Array()
        this.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM STUDENT', [], function (tx, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++){
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
        });
        this.student.age = ''
        this.student.sex = ''
        this.student.name = ''
        this.values = arry
      },
      remove_data: function (index,row) {
        this.db.transaction(function(tx) {
          tx.executeSql('DELETE FROM STUDENT WHERE id = ?',[row.id]);
        })
        this.get_data()
      },
      updata_data: function (index,row) {
        this.db.transaction(function (tx) {
          tx.executeSql('UPDATE STUDENT SET name = ?,sex = ?,age=? WHERE id=?',['聂志良','男',22,1522752037000]);
        })
        this.get_data()
      }
    }
  }
</script>
