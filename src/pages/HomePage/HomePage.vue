<script setup lang="ts">
import './HomePage.scss';

import { Task, TaskWithId } from '../../models/models';
import { getData, createTask } from '../../utils/api';

import BasePreloader from '../../components/UI/BasePreloader/BasePreloader.vue';
import BaseInput from '../../components/UI/BaseInput/BaseInput.vue';

interface Input {
  model: keyof Task;
  type: 'text' | 'password' | 'email' | 'date';
  placeholder?: string;
}

const taskList = ref<Task[]>([]);

const state = reactive<Task>({
  companySigDate: '',
  companySignatureName: '',
  documentName: '',
  documentStatus: '',
  documentType: '',
  employeeNumber: '',
  employeeSigDate: '',
  employeeSignatureName: '',
});

const inputs: Input[] = [
  {
    model: 'companySigDate',
    type: 'date',
  },
  {
    model: 'companySignatureName',
    type: 'text',
    placeholder: 'Введите текст',
  },
  {
    model: 'documentName',
    type: 'text',
    placeholder: 'Введите текст',
  },
  {
    model: 'documentStatus',
    type: 'text',
    placeholder: 'Введите текст',
  },
  {
    model: 'documentType',
    type: 'text',
    placeholder: 'Введите текст',
  },
  {
    model: 'employeeNumber',
    type: 'text',
    placeholder: 'Введите текст',
  },
  {
    model: 'employeeSigDate',
    type: 'date',
  },
  {
    model: 'employeeSignatureName',
    type: 'text',
    placeholder: 'Введите текст',
  },
];

const activeLoader = ref<boolean>(false);
const errorServer = ref<boolean>(false);

const handleCreateTask = async () => {
  const { companySigDate, employeeSigDate, ...rest } = state;

  const formattedTask: Task = {
    ...rest,
    companySigDate: new Date(companySigDate).toISOString() + '\t',
    employeeSigDate: new Date(employeeSigDate).toISOString() + '\t',
  };

  createTask(formattedTask)
    .then((res) => {
      const newTaskWithId: TaskWithId = {
        id: res.data.id,
        ...formattedTask,
      };
      taskList.value.push(newTaskWithId);
    })
    .catch((error) => {
      console.error('Произошла ошибка при создании задачи:', error);
    });
};

onMounted(() => {
  activeLoader.value = true;
  getData()
    .then((res) => {
      taskList.value = res.data;
    })
    .catch((error) => {
      errorServer.value = true;
      console.error('Произошла ошибка при получении карточек', error);
    })
    .finally(() => {
      activeLoader.value = false;
    });
});
</script>

<template>
  <section class="home">
    <template v-if="!errorServer">
      <BasePreloader v-if="activeLoader" />
      <template v-else>
        <h3 class="home__title">Добавление новой задачи</h3>
        <form @submit.prevent="handleCreateTask" class="home__form">
          <BaseInput
            v-for="input in inputs"
            :key="input.model"
            v-model="state[input.model]"
            :type="input.type"
            :name="input.model"
            :placeholder="input.placeholder"
          />
          <button type="submit" class="home__create">Создать задачу</button>
        </form>
        <h3 class="home__title">Задачи</h3>
        <ul class="home__tasks">
          <li v-for="task in taskList">{{ task }}</li>
        </ul>
      </template>
    </template>
    <p class="home__error" v-else>Произошла ошибка на сервере</p>
  </section>
</template>
