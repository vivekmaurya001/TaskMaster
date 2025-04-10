"use client";
import axios from 'axios';
const BACKEND_URL = 'http://localhost:3000';

// This is a sample axios get request
axios.get(BACKEND_URL)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log("Unable to contact with backend.")
    console.log(error);
  });

// This is a simple axios post request
axios.post(`${BACKEND_URL}/api/v1/swarm/write-ops`, {
  taskName : 'create-folder',
  targetName : "/home/hp/developmnt/new1"
})
.then(response => {
  console.log(response);
})
.catch(error => {
  console.log("This is the create-file error: ");
  console.log(error);
});

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

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
const initialLogs = [
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

export default function JobScheduler() {
  const [logs, setLogs] = useState<string[]>(initialLogs)
  const [tasks, setTasks] = useState<any[]>(initialTasks)
  const [activeTab, setActiveTab] = useState("dashboard")

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const date = new Date()
      .toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })
      .replace(/\//g, "-")
    setLogs((prev) => [`[${date} ${timestamp}] [system] ${message}`, ...prev])
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

  // Count tasks by status
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const failedTasks = tasks.filter((t) => t.status === "failed").length
  const pendingTasks = tasks.filter((t) => t.status === "pending").length
  const totalTasks = tasks.length

  return (
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
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon" className="text-zinc-400 border-zinc-800">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="icon" className="text-zinc-400 border-zinc-800">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2 text-zinc-400">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-zinc-900 border-r border-zinc-800 min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <nav className="space-y-1">
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "tasks" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("tasks")}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                Tasks
              </Button>
              <Button
                variant={activeTab === "history" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("history")}
              >
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
              <Button
                variant={activeTab === "logs" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("logs")}
              >
                <Terminal className="mr-2 h-4 w-4" />
                Logs
              </Button>
              <Button
                variant={activeTab === "settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-zinc-800">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">CPU Usage</span>
                  <span className="text-zinc-400">24%</span>
                </div>
                <Progress value={24} className="h-1" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Memory Usage</span>
                  <span className="text-zinc-400">42%</span>
                </div>
                <Progress value={42} className="h-1" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Disk Usage</span>
                  <span className="text-zinc-400">68%</span>
                </div>
                <Progress value={68} className="h-1" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-zinc-800 text-zinc-400">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                  <Button className="bg-purple-700 hover:bg-purple-600">
                    <Clock className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTasks}</div>
                    <p className="text-xs text-zinc-500 mt-1">+2 from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
                    <p className="text-xs text-zinc-500 mt-1">
                      {((completedTasks / totalTasks) * 100).toFixed(0)}% success rate
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Failed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">{failedTasks}</div>
                    <p className="text-xs text-zinc-500 mt-1">-1 from yesterday</p>
                  </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">{pendingTasks}</div>
                    <p className="text-xs text-zinc-500 mt-1">Next execution in 45m</p>
                  </CardContent>
                </Card>
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
                            {tasks.slice(0, 5).map((task) => (
                              <div
                                key={task.id}
                                className="p-3 border border-zinc-800 rounded-md text-sm bg-zinc-950/50"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium flex items-center">
                                    {task.type === "periodic" ? (
                                      <Calendar className="mr-2 h-4 w-4 text-purple-400" />
                                    ) : (
                                      <Clock className="mr-2 h-4 w-4 text-blue-400" />
                                    )}
                                    <span className="truncate max-w-[150px] text-white">
                                      {task.path.split("/").pop() || task.path}
                                    </span>
                                  </div>
                                  {getStatusBadge(task.status)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-2 space-y-1">
                                  {task.type === "non-periodic" && <div>Operation: {task.operation}</div>}
                                  {task.type === "periodic" && <div>Frequency: {task.frequency}</div>}
                                  <div>Worker: {task.workerId}</div>
                                  {task.lastRun && <div>Last run: {task.lastRun}</div>}
                                  {task.nextRun && <div>Next run: {task.nextRun}</div>}
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
                <CardTitle className="text-lg">System Logs</CardTitle>
                <CardDescription className="text-zinc-400">Real-time execution logs</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLog("Manual log entry")}
                  className="text-xs border-zinc-800 text-zinc-400"
                >
                  Add Test Log
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogs([])}
                  className="text-xs border-zinc-800 text-zinc-400"
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
                  if (log.includes("completed successfully")) logClass = "text-green-400"
                  if (log.includes("failed")) logClass = "text-red-400"
                  if (log.includes("started")) logClass = "text-blue-400"
                  if (log.includes("scheduled")) logClass = "text-yellow-400"

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
  )
}

function NonPeriodicTaskForm({ onAddTask }: { onAddTask: (data: any) => void }) {
  const [operation, setOperation] = useState<string>("")
  const [operationType, setOperationType] = useState<string>("")
  const [path, setPath] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!operation || !path) return

    onAddTask({
      operation: operation === "read" ? "Read" : "Write",
      operationType,
      path,
    })

    // Reset form
    setOperationType("")
    setPath("")
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
                <RadioGroupItem value="read" id="read" className="bg-white text-black"/>
                <Label htmlFor="read" className="flex items-center text-zinc-300">
                  <FileText className="mr-2 h-4 w-4 text-blue-400" />
                  Read Operation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="write" id="write" className="bg-white text-black"/>
                <Label htmlFor="write" className="flex items-center text-zinc-300">
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
                  {operation === "read" ? (
                    <>
                      <SelectItem value="file-read">File Read</SelectItem>
                      <SelectItem value="database-query">Database Query</SelectItem>
                      <SelectItem value="api-fetch">API Fetch</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="file-write">File Write</SelectItem>
                      <SelectItem value="database-update">Database Update</SelectItem>
                      <SelectItem value="api-post">API Post</SelectItem>
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

    // Reset form
    setPath("")
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 ">
      <CardHeader className="text-cyan-50">
        <CardTitle>Add Periodic Task</CardTitle>
        <CardDescription className="text-zinc-400">Schedule a recurring task</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white border-zinc-800">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-800">
                <SelectItem value="Hourly">Hourly</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Custom">Custom Cron</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === "Custom" && (
            <div className="space-y-2">
              <Label className="text-zinc-400">Cron Expression</Label>
              <Input placeholder="* * * * *" className="bg-zinc-950 border-zinc-800" />
              <p className="text-xs text-zinc-500">Format: minute hour day month weekday</p>
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

          <Button type="submit" disabled={!frequency || !path} className="bg-purple-700 hover:bg-purple-600">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
