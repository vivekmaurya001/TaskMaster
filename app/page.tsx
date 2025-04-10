"use client";
import axios from 'axios';
import Cron from 'react-cron-generator';
import 'react-cron-generator/dist/cron-builder.css';
const BACKEND_URL = 'http://localhost:3000';


import type React from "react"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Calendar,
  FileText,
  FilePen,
  LayoutDashboard,
  ListTodo,
  Settings,
  History,
  Terminal,
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpDown,
} from "lucide-react"

// Dummy data for tasks
const initialTasks = [
  {
    id: 1,
    type: "periodic",
    frequency: "Hourly",
    path: "/usr/local/bin/backup-db.sh",
    createdAt: "2025-04-08 09:15:22",
    lastRun: "2025-04-09 10:00:03",
    nextRun: "2025-04-09 11:00:00",
    status: "completed",
    workerId: "worker-03",
  },
  {
    id: 2,
    type: "non-periodic",
    operation: "Read",
    operationType: "Database Query",
    path: "SELECT * FROM users WHERE last_login > NOW() - INTERVAL 24 HOUR",
    createdAt: "2025-04-09 08:30:15",
    lastRun: "2025-04-09 08:35:12",
    status: "completed",
    workerId: "worker-01",
  },
  {
    id: 3,
    type: "periodic",
    frequency: "Daily",
    path: "/scripts/generate-reports.py",
    createdAt: "2025-04-07 16:45:30",
    lastRun: "2025-04-09 00:00:12",
    nextRun: "2025-04-10 00:00:00",
    status: "completed",
    workerId: "worker-02",
  },
  {
    id: 4,
    type: "non-periodic",
    operation: "Write",
    operationType: "File Write",
    path: "/var/www/html/config/settings.json",
    createdAt: "2025-04-09 09:50:45",
    lastRun: "2025-04-09 09:51:22",
    status: "failed",
    workerId: "worker-01",
  },
  {
    id: 5,
    type: "periodic",
    frequency: "Weekly",
    path: "/usr/bin/cleanup-temp.sh",
    createdAt: "2025-04-02 11:20:10",
    lastRun: "2025-04-07 00:00:05",
    nextRun: "2025-04-14 00:00:00",
    status: "pending",
    workerId: "worker-03",
  },
]

// Dummy logs
let initialLogs = [
  "[2025-04-09 10:00:01] [worker-03] Task #1 started: /usr/local/bin/backup-db.sh",
  "[2025-04-09 10:00:03] [worker-03] Task #1 completed successfully in 2.1s",
  "[2025-04-09 09:51:20] [worker-01] Task #4 started: Writing to /var/www/html/config/settings.json",
  "[2025-04-09 09:51:22] [worker-01] Task #4 failed: Permission denied",
  "[2025-04-09 09:45:00] [system] Worker worker-02 connected",
  "[2025-04-09 09:30:15] [system] Scheduler service started",
  "[2025-04-09 09:00:00] [worker-03] Task #5 scheduled for 2025-04-14 00:00:00",
  "[2025-04-09 08:35:10] [worker-01] Task #2 started: Executing database query",
  "[2025-04-09 08:35:12] [worker-01] Task #2 completed successfully in 1.8s",
  "[2025-04-09 08:30:15] [system] New task added: Database Query",
  "[2025-04-09 08:15:00] [system] Daily system check completed",
  "[2025-04-09 08:00:01] [worker-02] Memory usage: 42%, CPU usage: 18%",
  "[2025-04-09 00:00:10] [worker-02] Task #3 started: /scripts/generate-reports.py",
  "[2025-04-09 00:00:12] [worker-02] Task #3 completed successfully in 2.4s",
]

interface LogInfo {
  _id: string;
  machineId: string;
  command: string;
  result: any;
  createdAt: string;
  updatedAt: string;
}

// Define an interface for the API response structure
interface LogsResponse {
  statusCode: number;
  message: string;
  info: LogInfo[];
}

// A simple Modal component using TailwindCSS



export default function JobScheduler() {
  const [logs, setLogs] = useState<string[]>(initialLogs)
  const [result, setResult] = useState<string>("")
  const [tasks, setTasks] = useState<any[]>(initialTasks)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isModalOpen, setIsModalOpen] = useState(false);
  function Modal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        {/* Modal content */}
        <div className="relative bg-white p-6 rounded shadow-md z-10 w-11/12 max-w-md">
          {children}
        </div>
      </div>
    );
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const date = new Date()
      .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/\//g, "-")
    setLogs((prev) => [`[${date} ${timestamp}] [system] ${message}`, ...prev])
  }
  async function fetchLogs(): Promise<string[]> {
    try {
      // Tell axios to expect a LogsResponse type
      const response = await axios.get<LogsResponse>(`${BACKEND_URL}/api/v1/swarm/getlog/`);
      const fetchedLogs = response.data.info;
  
      // Map each fetched log object to a formatted string
      setTasks(fetchedLogs);
      console.log("hiashic", fetchedLogs)
      const formattedLogs = fetchedLogs.map((log) => {
        const timestamp = new Date(log.createdAt).toLocaleString();
        return `[${timestamp}] [${log.machineId}] executed command: ${log.command}`;
      });
      console.log(formattedLogs);
      initialLogs = formattedLogs; // Update initialLogs with fetched logs
  
      return formattedLogs;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }



  const handleAddTask = (type: "periodic" | "non-periodic", data: any) => {
    const newTask = {
      id: Date.now(),
      type,
      ...data,
      createdAt: new Date().toLocaleString(),
      status: "pending",
      workerId: `worker-0${Math.floor(Math.random() * 3) + 1}`,
    }

    if (type === "periodic") {
      // Calculate next run time based on frequency
      const now = new Date()
      const nextRun = new Date(now)

      switch (data.frequency.toLowerCase()) {
        case "hourly":
          nextRun.setHours(now.getHours() + 1)
          break
        case "daily":
          nextRun.setDate(now.getDate() + 1)
          break
        case "weekly":
          nextRun.setDate(now.getDate() + 7)
          break
        case "monthly":
          nextRun.setMonth(now.getMonth() + 1)
          break
      }

      newTask.nextRun = nextRun.toLocaleString()
    }

    setTasks((prev) => [newTask, ...prev])
    addLog(`New ${type} task added: ${data.path}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-800">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
    }
  }

  return (
    <>
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold text-lg text-white">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-purple-700">
              <Clock className="h-5 w-5" />
            </div>
            <span>TaskMaster</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-2">
                </div>
              </div>

              {/* Task form and recent tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tabs defaultValue="non-periodic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                      <TabsTrigger value="non-periodic" className="data-[state=active]:bg-zinc-700 text-white">
                        <Clock className="mr-2 h-4 w-4" />
                        Non-Periodic Task
                      </TabsTrigger>
                      <TabsTrigger value="periodic" className="data-[state=active]:bg-zinc-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Periodic Task
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="non-periodic">
                      <NonPeriodicTaskForm onAddTask={(data) => handleAddTask("non-periodic", data)} />
                    </TabsContent>

                    <TabsContent value="periodic">
                      <PeriodicTaskForm onAddTask={(data) => handleAddTask("periodic", data)} />
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="text-white">
                      <CardTitle>Recent Tasks</CardTitle>
                      <CardDescription className="text-zinc-400">Recently executed tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[350px]">
                        {tasks.length === 0 ? (
                          <p className="text-sm text-zinc-500">No tasks scheduled yet</p>
                        ) : (
                          <div className="space-y-3">
                            {tasks.map((task) => (
                              <div
                                key={task._id}
                                className="p-3 border border-zinc-800 rounded-md text-sm bg-zinc-950/50"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-purple-400" />
                                    <span className="truncate max-w-[150px] text-white">
                                      {task.command}
                                    </span>
                                  </div>
                                  <Button className={`bg-gray-900 ${!task.result ? 'hidden' : ''}`}  onClick={()=>{
                                    setResult(task.result);
                                    setIsModalOpen(true);
                                  }}>See detail</Button>
                                </div>
                                <div className="text-xs text-zinc-500 mt-2 space-y-1">
                                  <div>Operation: {task.command && task.command.trim().split(' ')[0]}</div>
                                  <div>Worker: {task.machineId}</div>
                                  {task.createdAt && <div>Last run: {task.createdAt}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Logs section */}
          <Card className="mt-6 bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg text-white">System Logs</CardTitle>
                <CardDescription className="text-zinc-400">Real-time execution logs</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLogs().then(setLogs)}
                  className="text-xs border-zinc-800 text-black"
                >
                  Fetch Logs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs border-zinc-800 text-black"
                >
                  Clear Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] bg-zinc-950 font-mono p-4 rounded-md border border-zinc-800">
                {logs.map((log, index) => {
                  // Color-code different log types
                  let logClass = "text-zinc-400"
                  let num=Math.floor(Math.random()*4);
                  if (num==1) logClass = "text-green-400"
                  if (num==2) logClass = "text-red-400"
                  if (num==3) logClass = "text-blue-400"
                  if (num==4) logClass = "text-yellow-400"

                  return (
                    <div key={index} className={`text-sm ${logClass} py-0.5`}>
                      {log}
                    </div>
                  )
                })}
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <div className="relative p-6 bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200">
    
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405M19.595 15.595A2.828 2.828 0 0018 15h-3m-2 0a2.828 2.828 0 00-1.595.595l-1.405 1.405m0 0H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v6" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Task Output</h2>
      </div>
    </div>

    {/* Result Display */}
    <div className="overflow-auto bg-gray-100 rounded-md p-4 text-sm text-gray-800 font-mono whitespace-pre-wrap max-h-[60vh] border border-gray-200">
    {result
  ? result.split('\n').map((item, index) => (
      <div key={index}>{item}</div>
    ))
  : "nothing"}
    </div>

    {/* Footer */}
    <div className="flex justify-end mt-6">
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
    </Modal>

    </>
  )
}

function NonPeriodicTaskForm({ onAddTask }: { onAddTask: (data: any) => void }) {
  const [operation, setOperation] = useState<string>("")
  const [operationType, setOperationType] = useState<string>("")
  const [path, setPath] = useState<string>("")

  async function OPS(body: any) {
    try {
      console.log(operationType);
      console.log(operation);
      console.log(path);
      console.log(body);

      
      let response:any;
      if(operation==="read-ops"){
        console.log(body);
        response = await axios.post(`http://localhost:3000/api/v1/swarm/${operation}`, body);
      }else{
        response = await axios.post(`http://localhost:3000/api/v1/swarm/${operation}`, body);
      }
      console.log('Done :', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!operation || !path) return
console.log(operationType);
console.log(path);
    const requestBody = {
      taskName: operationType,
      targetName: path,
    };

    try {
      const result = await OPS(requestBody);
      console.log("Task successfully sent:", result);
    } catch (error) {
      console.error("Failed to submit task", error);
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="text-cyan-50">
        <CardTitle>Add Non-Periodic Task</CardTitle>
        <CardDescription className="text-zinc-400">Schedule a one-time task to be executed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Operation Type</Label>
            <RadioGroup value={operation} onValueChange={setOperation} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="read-ops" id="read" className="bg-white text-black"/>
                <Label htmlFor="read-ops" className="flex items-center text-zinc-300">
                  <FileText className="mr-2 h-4 w-4 text-blue-400" />
                  Read Operation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="write-ops" id="write" className="bg-white text-black"/>
                <Label htmlFor="write-ops" className="flex items-center text-zinc-300">
                  <FilePen className="mr-2 h-4 w-4 text-purple-400" />
                  Write Operation
                </Label>
              </div>
            </RadioGroup>
          </div>

          {operation && (
            <div className="space-y-2">
              <Label className="text-zinc-400">Specific Operation</Label>
              <Select value={operationType} onValueChange={setOperationType}>
                <SelectTrigger className="bg-white border-zinc-800">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-800">
                  {operation === "read-ops" ? (
                    <>
                      <SelectItem value="fileRead">get history</SelectItem>
                      <SelectItem value="lsDir">get lsDir</SelectItem>
                      <SelectItem value="history">file Read</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="create-folder">Create folder</SelectItem>
                      <SelectItem value="create-file">Create file</SelectItem>
                      <SelectItem value="delete-file">delete file</SelectItem>
                      <SelectItem value="delete-folder">delete folder</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-zinc-400">Execution Path</Label>
            <Input
              placeholder="Enter path or command to execute"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="bg-white border-zinc-800"
            />
          </div>

          <Button type="submit" disabled={!operation || !path} className="bg-purple-700 hover:bg-purple-600">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PeriodicTaskForm({ onAddTask }: { onAddTask: (data: any) => void }) {
  const [frequency, setFrequency] = useState<string>("")
  const [path, setPath] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!frequency || !path) return

    onAddTask({
      frequency,
      path,
    })

    setPath("")
  }
  const [state, setState] = useState({ value: '', text: '' });

  const handleSubmit2 = () => {
    console.log('Cron Expression:', state.value);
    console.log('Human Text:', state.text);
  };

  return (
    <div>
      <h2>Cron Scheduler</h2>
      <Cron
        onChange={(e, text) => {
          setState({ value: e, text: text });
        }}
        value={state.value}
        showResultText={true}
        showResultCron={true}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit2}>Submit</button>
      </div>
      <div>
        <p><strong>Selected cron:</strong> {state.value}</p>
        <p><strong>Description:</strong> {state.text}</p>
      </div>
    </div>
  );

}
