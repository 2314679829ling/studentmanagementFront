<template>
  <div class="student-management">
    <el-card class="main-card">
      <div class="header">
        <div class="title-area">
          <h2>学生管理系统</h2>
          <el-tag v-if="isAdmin" type="success" effect="dark">管理员</el-tag>
          <el-tag v-else type="info" effect="dark">普通用户</el-tag>
        </div>
        <div class="user-area">
          <div class="username"><h1>{{ username }}</h1></div>
          <el-button type="danger" @click="handleLogout" plain>退出登录</el-button>
        </div>
      </div>

      <!-- 搜索区域 -->
      <div class="search-area">
        <div class="left">
          <el-input
            v-model="searchQuery"
            placeholder="输入姓名或班级搜索"
            style="width: 200px"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="right">
          <el-button type="primary" @click="showAddDialog" :disabled="!isAdmin">
            <el-icon><Plus /></el-icon>添加学生
          </el-button>
        </div>
      </div>

      <!-- 学生列表 -->
      <el-table :data="displayStudents" style="margin-top: 20px" border stripe>
        <el-table-column prop="id" label="学号" width="100" align="center" />
        <el-table-column prop="name" label="姓名" width="120" align="center" />
        <el-table-column prop="age" label="年龄" width="100" align="center" />
        <el-table-column prop="grade" label="年级" width="120" align="center" />
        <el-table-column prop="className" label="班级" align="center" />
        <el-table-column label="操作" width="200" align="center" v-if="isAdmin">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)" plain>
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          :total="filteredStudents.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="currentStudent" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="currentStudent.name" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="currentStudent.age" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="currentStudent.grade" placeholder="请选择年级" style="width: 100%">
            <el-option label="大一" value="大一" />
            <el-option label="大二" value="大二" />
            <el-option label="大三" value="大三" />
            <el-option label="大四" value="大四" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="currentStudent.className" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import type { Student } from '../types/student'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { studentApi } from '../api'
import { AuthService } from '@/services/auth.service'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const students = ref<Student[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索过滤
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.className.toLowerCase().includes(query)
  )
})

// 分页显示
const displayStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredStudents.value.slice(start, end)
})

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const currentStudent = reactive<Student>({
  id: 0,
  name: '',
  age: 0,
  grade: '',
  className: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }]
}

// 显示添加对话框
const showAddDialog = () => {
  dialogTitle.value = '添加学生'
  isEdit.value = false
  Object.assign(currentStudent, {
    id: 0,
    name: '',
    age: 0,
    grade: '',
    className: ''
  })
  dialogVisible.value = true
}

// 显示编辑对话框
const handleEdit = (row: Student) => {
  dialogTitle.value = '编辑学生'
  isEdit.value = true
  Object.assign(currentStudent, row)
  dialogVisible.value = true
}

// 获取学生列表
const fetchStudents = async () => {
  try {
    console.log('开始获取学生列表')
    const res = await studentApi.getList()
    console.log('获取到的数据：', res)
    if (res.data.code === 200) {
      students.value = res.data.data
      console.log('设置后的学生列表：', students.value)
    } else {
      ElMessage.error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取学生列表失败：', error)
    ElMessage.error('获取学生列表失败')
  }
}

// 保存学生信息
const handleSave = async () => {
  try {
    if (isEdit.value) {
      await studentApi.update(currentStudent)
    } else {
      await studentApi.add(currentStudent)
    }
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
    fetchStudents()
  } catch (error: any) {
    if (error.response?.status === 403) {
      ElMessage.error('只有管理员才能进行此操作')
    } else {
      ElMessage.error('操作失败')
    }
  }
}

// 删除学生
const handleDelete = async (row: Student) => {
  try {
    await ElMessageBox.confirm('确定要删除该学生吗？', '提示', {
      type: 'warning'
    })
    await studentApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchStudents()
  } catch (error: any) {
    if (error === 'cancel') return
    if (error.response?.status === 403) {
      ElMessage.error('只有管理员才能进行此操作')
    } else {
      ElMessage.error('删除失败')
    }
  }
}

// 添加退出登录方法
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '退出后将无法自动登录，是否确认退出？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    AuthService.logout()
    router.push('/login')
  } catch {
    // 用户取消退出
  }
}

const user = AuthService.getCurrentUser()
const isAdmin = ref(user?.role === 'admin')
const username = ref(user?.username || '未知用户')

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-management {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-card {
  min-height: calc(100vh - 40px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-area h2 {
  margin: 0;
  color: #303133;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
  color: #606266;
}

.search-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
