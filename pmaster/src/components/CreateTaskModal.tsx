import { useState } from "react";
import type { Task, TaskStatus } from "../types/apiTypes";
import { createTask, updateTask } from "../api/tasks";

interface CreateTaskModalProps {
  statusId: number;
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: Task) => void;
  availableStatuses: TaskStatus[];
  initialValues?: Task;
}

export const CreateTaskModal = ({
  statusId,
  projectId,
  isOpen,
  onClose,
  onTaskCreated,
  availableStatuses,
  initialValues,
}: CreateTaskModalProps) => {
  const isEditing = initialValues !== undefined;
  const { title, btnText, loaderText } = isEditing ? {
    title: 'Edit task',
    btnText: 'Edit',
    loaderText: 'Editing...'
  } : {
    title: 'Create new task',
    btnText: 'Create',
    loaderText: 'Creating...'
  }
  const [formData, setFormData] = useState(
    initialValues
      ? { ...initialValues, status_id: statusId }
      : {
          title: "",
          description: "",
          deadline: "",
          status_id: statusId,
        }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const response = await updateTask(initialValues.id, {
          ...formData,
          project_id: projectId,
          status_id: Number(formData.status_id),
          deadline: formData.deadline,
        });
        onTaskCreated(response.data);
        onClose();
        return;
      }
      const response = await createTask({
        ...formData,
        project_id: projectId,
        status_id: Number(formData.status_id),
        deadline: formData.deadline || new Date().toISOString(),
      });

      onTaskCreated(response.data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-900 text-red-100 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Status</label>
              <select
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                {availableStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? loaderText : btnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
