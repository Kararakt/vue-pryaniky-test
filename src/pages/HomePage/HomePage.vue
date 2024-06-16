<script setup lang="ts">
import './HomePage.scss';

import { Task, TaskWithId } from '../../models/models';
import { getData, createTask, deleteTask, updateTask } from '../../utils/api';
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

const editState = reactive<Task>({
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
const disableButton = ref<boolean>(false);
const deletingTasks = ref<string[]>([]);
const editingTaskId = ref<string>('');
const disableEditButton = ref<boolean>(false);

const taskListHasItems = computed(() => taskList.value.length > 0);

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

const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return '';

  const trimmedDateString = dateString.trim();

  const date = new Date(trimmedDateString);
  if (isNaN(date.getTime())) {
    console.error(`Неверный формат даты: ${dateString}`);
    return '';
  }

  return date.toISOString().split('T')[0];
};

const handleClickEditTask = (task: TaskWithId) => {
  Object.assign(editState, {
    ...task,
    companySigDate: formatDateForInput(task.companySigDate),
    employeeSigDate: formatDateForInput(task.employeeSigDate),
  });
  editingTaskId.value = task.id;
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
    })
    .finally(() => {
      deletingTasks.value.length = 0;
    });
};

const handleUpdateTask = () => {
  disableEditButton.value = true;

  const formattedTask: Task = {
    ...editState,
    companySigDate: new Date(editState.companySigDate).toISOString(),
    employeeSigDate: new Date(editState.employeeSigDate).toISOString(),
  };

  updateTask(formattedTask, editingTaskId.value)
    .then((res) => {
      handleResponseError(res);

      const updatedIndex = taskList.value.findIndex(
        (task) => task.id === editingTaskId.value
      );

      if (updatedIndex !== -1) {
        taskList.value[updatedIndex] = {
          id: editingTaskId.value,
          ...formattedTask,
        };

        editingTaskId.value = '';
      } else {
        console.error(`Задача с ID ${editingTaskId.value} не найдена в списке`);
      }
    })
    .catch((error) => {
      showPopup();
      console.log('Произошла ошибка при редактирование задачи:', error);
    })
    .finally(() => {
      disableEditButton.value = false;
    });
};

onMounted(() => {
  activeLoader.value = true;

  getData()
    .then((res) => {
      handleResponseError(res);

      taskList.value = res.data;
    })
    .catch((error) => {
      showPopup();
      console.error('Произошла ошибка при получении карточек', error);
    })
    .finally(() => {
      activeLoader.value = false;
    });
});
</script>

<template>
  <section class="home">
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
      <ul class="home__tasks" v-if="taskListHasItems">
        <li v-for="task in taskList" class="home__task">
          <div class="home__wrapper">
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
              <font-awesome-icon
                icon="fa-solid fa-pen-to-square"
                class="home__edit"
                @click="handleClickEditTask(task)"
              />
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
          </div>

          <form
            @submit.prevent="handleUpdateTask"
            class="home__edit-form"
            v-if="editingTaskId === task.id"
          >
            <div class="home__inputs">
              <BaseInput
                v-for="input in inputs"
                :key="'edit-' + input.model"
                v-model="editState[input.model]"
                :type="input.type"
                :name="'edit-' + input.model"
                :placeholder="input.placeholder"
              />
            </div>

            <div class="home__buttons">
              <button
                :disabled="disableEditButton"
                type="submit"
                class="home__create"
              >
                {{ disableEditButton ? 'Сохраняем...' : 'Сохранить' }}
              </button>
              <button
                type="button"
                @click="editingTaskId = ''"
                class="home__create"
              >
                Отмена
              </button>
            </div>
          </form>
        </li>
      </ul>
      <span v-else class="home__empty">Пока нет ни одной задачи</span>
    </template>
  </section>

  <InfoTooltip v-model="isPopupVisible" :closePopup="hidePopup" />
</template>
