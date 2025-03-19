import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

const API_BASE_URL = '/api';

export async function fetchUserData() {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
}

export async function fetchClaimPost() {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/user/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch claim data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
}

export async function fetchClaimData() {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/user/claim`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch claim data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
}

export async function fetchReferralsData(telegramId) {
  try {
    const { initDataRaw } = retrieveLaunchParams();

    const headers = {
      'Content-Type': 'application/json',
      'initdata': initDataRaw,
    };

    if (telegramId) {
      headers['telegramid'] = telegramId;
    }

    const response = await fetch(`${API_BASE_URL}/user/referrals`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user referrals data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
}

export async function fetchLeaderboardData() {
  try {
    const { initDataRaw } = retrieveLaunchParams();

    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch wallet data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after 30 seconds');
      throw new Error('Request timed out');
    }
    console.error('Error fetching wallet data:', error.message);
    throw error;
  }
}

export async function claimTask(taskId) {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/tasks/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      },
      body: JSON.stringify({ task_id: taskId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to claim task');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error claiming task:', error.message);
    throw error;
  }
}

export async function addTask(taskData) {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/tasks/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add task');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding task:', error.message);
    throw error;
  }
}

export async function editTask(taskData) {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/tasks/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add task');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding task:', error.message);
    throw error;
  }
}

export async function fetchUserTasks() {
  try {
    const { initDataRaw } = retrieveLaunchParams();
    const response = await fetch(`${API_BASE_URL}/user/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'initdata': initDataRaw,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user tasks');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user tasks:', error.message);
    throw error;
  }
}

export async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
       
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch tasks');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    throw error;
  }
}