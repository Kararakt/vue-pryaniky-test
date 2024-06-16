<script setup lang="ts">
import './HomePage.scss';

import { Task, TaskWithId } from '../../models/models';
import { getData, createTask, deleteTask } from '../../utils/api';
import { handleResponseError } from '../../utils/errorHandler';
import { usePopup } from '../../composables/usePopup';

import BasePreloader from '../../components/UI/BasePreloader/BasePreloader.vue';
import BaseInput from '../../components/UI/BaseInput/BaseInput.vue';
import InfoTooltip from '../../components/InfoTooltip/InfoTooltip.vue';

interface Input {
  model: keyof Task;
  type: 'text' | 'password' | 'email' | 'date';
  placeholder?: string;
}

const taskList = ref<TaskWithId[]>([]);

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

const { isPopupVisible, showPopup, hidePopup } = usePopup();

const activeLoader = ref<boolean>(false);
const errorServer = ref<boolean>(false);
const disableButton = ref<boolean>(false);
const deletingTasks = ref<string[]>([]);

const resetState = () => {
  state.companySigDate = '';
  state.companySignatureName = '';
  state.documentName = '';
  state.documentStatus = '';
  state.documentType = '';
  state.employeeNumber = '';
  state.employeeSigDate = '';
  state.employeeSignatureName = '';
};

const handleCreateTask = async () => {
  disableButton.value = true;

  const { companySigDate, employeeSigDate, ...rest } = state;

  const formattedTask: Task = {
    ...rest,
    companySigDate: new Date(companySigDate).toISOString() + '\t',
    employeeSigDate: new Date(employeeSigDate).toISOString() + '\t',
  };

  createTask(formattedTask)
    .then((res) => {
      handleResponseError(res);

      const newTaskWithId: TaskWithId = {
        id: res.data.id,
        ...formattedTask,
      };
      taskList.value.push(newTaskWithId);

      resetState();
    })
    .catch((error) => {
      showPopup();
      console.error('Произошла ошибка при создании задачи:', error);
    })
    .finally(() => {
      disableButton.value = false;
    });
};

const handleDeleteCard = async (id: string) => {
  deletingTasks.value.push(id);

  deleteTask(id)
    .then((res) => {
      handleResponseError(res);

      taskList.value = taskList.value.filter((task) => task.id !== id);
    })
    .catch((error) => {
      showPopup();
      console.error('Произошла ошибка при удалении карточки:', error);
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
          <button :disabled="disableButton" type="submit" class="home__create">
            {{ disableButton ? 'Создаём задачу...' : 'Создать задачу' }}
          </button>
        </form>
        <h3 class="home__title">Задачи</h3>
        <ul class="home__tasks">
          <li v-for="task in taskList" class="home__task">
            <div class="home__task-info">
              <span>{{ task.companySigDate }}</span>
              <span>{{ task.companySignatureName }}</span>
              <span>{{ task.documentName }}</span>
              <span>{{ task.documentStatus }}</span>
              <span>{{ task.documentType }}</span>
              <span>{{ task.employeeNumber }}</span>
              <span>{{ task.employeeSigDate }}</span>
              <span>{{ task.employeeSignatureName }}</span>
            </div>
            <div class="home__icons">
              <font-awesome-icon icon="fa-solid fa-x" class="home__edit" />
              <span
                v-if="deletingTasks.includes(task.id)"
                class="home__delete-loading"
              >
                Удаление...
              </span>
              <font-awesome-icon
                @click="handleDeleteCard(task.id)"
                icon="fa-solid fa-trash"
                class="home__delete"
                v-else
              />
            </div>
          </li>
        </ul>
      </template>
    </template>
    <p class="home__error" v-else>Произошла ошибка на сервере</p>
  </section>

  <InfoTooltip v-model="isPopupVisible" :closePopup="hidePopup" />
</template>
