"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingTask, setClaimingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks/get");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getSocialIcon = (url) => {
    if (url?.includes('x.com') || url?.includes('twitter.com')) {
      return <FaXTwitter size={16} className="text-white" />;
    } else if (url?.includes('t.me')) {
      return <FaTelegram size={16} className="text-white" />;
    } else if (url?.includes('discord')) {
      return <FaDiscord size={16} className="text-white" />;
    }
    return null;
  };

  const getTaskTypeLabel = (type) => {
    switch (type) {
      case 'social':
        return 'Social Media';
      case 'daily':
        return 'Daily';
      case 'referral':
        return 'Referral';
      case 'profile':
        return 'Profile';
      default:
        return type;
    }
  };

  const handleClaimTask = async (taskId) => {
    setClaimingTask(taskId);
    
    try {
      // انتظار 10 ثواني
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const response = await fetch('/api/tasks/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: taskId }),
      });

      const data = await response.json();

      if (data.success) {
        // تحديث حالة المهمة في الواجهة
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: true } 
              : task
          )
        );
      } else {
        console.error('Error claiming task:', data.error);
      }
    } catch (error) {
      console.error('Error claiming task:', error);
    } finally {
      setClaimingTask(null);
    }
  };

  // تجميع المهام حسب النوع
  const tasksByType = tasks.reduce((acc, task) => {
    if (!acc[task.type]) {
      acc[task.type] = [];
    }
    acc[task.type].push(task);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {Object.entries(tasksByType).map(([type, typeTasks]) => (
          <div key={type} className="space-y-4">
            <h2 className="text-sm font-bold text-white">{getTaskTypeLabel(type)}</h2>
            <div className="space-y-3">
              {typeTasks.map((task) => (
                <Card key={task.id} className="bg-gray-800">
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-700 rounded-lg">
                          {task.image_url ? (
                            <Image
                              src={task.image_url}
                              alt={task.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-white">
                              {getSocialIcon(task.action_url)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{task.name}</h3>
                          <p className="text-xs text-gray-400">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                          <span className="text-sm font-medium text-white">{task.reward}</span>
                          <Image
                            src="/assets/white.png"
                            alt="Reward"
                            width={16}
                            height={16}
                          />
                        </div>
                        {task.action_url ? (
                          <Button
                            as="a"
                            href={task.action_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            color="primary"
                            className="text-xs"
                          >
                            <FaPlay size={10} />
                            <span>Start</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            color={task.completed ? "success" : "primary"}
                            isDisabled={claimingTask === task.id || task.completed}
                            isLoading={claimingTask === task.id}
                            onClick={() => handleClaimTask(task.id)}
                            className="text-xs"
                          >
                            {task.completed ? "Completed" : "Start"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}