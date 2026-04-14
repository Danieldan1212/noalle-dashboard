"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  FileText,
  Presentation,
  BookMarked,
  GraduationCap,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Course {
  id: string;
  name: string;
  nameHe: string;
  semester: string | null;
  examDate: string | null;
  materials: Material[];
  topics: { id: string; nameHe: string; mastery: number }[];
}

interface Material {
  id: string;
  type: string;
  title: string;
  year: number | null;
  processed: boolean;
  createdAt: string;
}

const MATERIAL_TYPES = [
  { value: "exam", label: "מבחן", icon: GraduationCap },
  { value: "lecture", label: "הרצאה", icon: FileText },
  { value: "textbook", label: "ספר", icon: BookMarked },
  { value: "slides", label: "מצגת", icon: Presentation },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formNameHe, setFormNameHe] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formExamDate, setFormExamDate] = useState("");

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  function resetForm() {
    setFormName("");
    setFormNameHe("");
    setFormSemester("");
    setFormExamDate("");
    setEditingCourse(null);
    setShowAddCourse(false);
  }

  function startEdit(course: Course) {
    setFormName(course.name);
    setFormNameHe(course.nameHe);
    setFormSemester(course.semester || "");
    setFormExamDate(
      course.examDate
        ? new Date(course.examDate).toISOString().split("T")[0]
        : ""
    );
    setEditingCourse(course);
    setShowAddCourse(true);
  }

  async function handleSubmitCourse(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      name: formName,
      nameHe: formNameHe,
      semester: formSemester || null,
      examDate: formExamDate ? new Date(formExamDate).toISOString() : null,
    };

    const url = editingCourse
      ? `/api/courses?id=${editingCourse.id}`
      : "/api/courses";
    const method = editingCourse ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchCourses();
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("האם אתה בטוח שברצונך למחוק את הקורס?")) return;

    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  }

  async function handleFileUpload(courseId: string, files: FileList | null) {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("type", "exam"); // Default type, user can change

      try {
        await fetch("/api/materials", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    fetchCourses();
  }

  function handleDrag(e: React.DragEvent, courseId: string, entering: boolean) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(entering ? courseId : null);
  }

  function handleDrop(e: React.DragEvent, courseId: string) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    handleFileUpload(courseId, e.dataTransfer.files);
  }

  async function handleScrape(courseId: string) {
    if (!scrapeUrl) return;
    setScraping(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl, courseId }),
      });

      if (res.ok) {
        setScrapeUrl("");
        fetchCourses();
      }
    } catch (error) {
      console.error("Error scraping:", error);
    } finally {
      setScraping(false);
    }
  }

  async function handleDeleteMaterial(materialId: string) {
    try {
      const res = await fetch(`/api/materials?id=${materialId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-0">קורסים</h1>
          <p className="text-gray-500">נהל את הקורסים וחומרי הלימוד שלך</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddCourse(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          הוסף קורס
        </button>
      </div>

      {/* Add/Edit Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary-600">
                {editingCourse ? "עריכת קורס" : "הוספת קורס חדש"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-4">
              <div>
                <label className="label-text">שם הקורס (עברית)</label>
                <input
                  type="text"
                  value={formNameHe}
                  onChange={(e) => setFormNameHe(e.target.value)}
                  className="input-field"
                  placeholder="לדוגמה: מבוא לכלכלה"
                  required
                />
              </div>

              <div>
                <label className="label-text">שם הקורס (אנגלית)</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Introduction to Economics"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label className="label-text">סמסטר</label>
                <select
                  value={formSemester}
                  onChange={(e) => setFormSemester(e.target.value)}
                  className="input-field"
                >
                  <option value="">בחר סמסטר</option>
                  <option value="א 2026">סמסטר א&apos; 2026</option>
                  <option value="ב 2026">סמסטר ב&apos; 2026</option>
                  <option value="קיץ 2026">סמסטר קיץ 2026</option>
                  <option value="א 2025">סמסטר א&apos; 2025</option>
                  <option value="ב 2025">סמסטר ב&apos; 2025</option>
                </select>
              </div>

              <div>
                <label className="label-text">תאריך מבחן</label>
                <input
                  type="date"
                  value={formExamDate}
                  onChange={(e) => setFormExamDate(e.target.value)}
                  className="input-field"
                  dir="ltr"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingCourse ? "עדכן" : "הוסף"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex-1"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-primary-700 mb-2">
            עדיין אין קורסים
          </h2>
          <p className="text-gray-500 mb-6">
            הוסף את הקורסים שלך כדי להתחיל ללמוד
          </p>
          <button
            onClick={() => setShowAddCourse(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            הוסף קורס ראשון
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="card">
              {/* Course Header */}
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course.id ? null : course.id
                    )
                  }
                >
                  <h3 className="text-lg font-bold text-primary-700">
                    {course.nameHe}
                  </h3>
                  <p className="text-sm text-gray-400">{course.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {course.semester && <span>סמסטר {course.semester}</span>}
                    {course.examDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        מבחן: {formatDate(course.examDate)}
                      </span>
                    )}
                    <span>{course.materials.length} חומרים</span>
                    <span>{course.topics.length} נושאים</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(course)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-cream-200 rounded-lg transition-colors"
                    title="ערוך"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="מחק"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCourse === course.id && (
                <div className="mt-6 pt-6 border-t border-cream-300">
                  {/* File Upload Area */}
                  <h4 className="font-bold text-primary-600 mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    העלאת חומרי לימוד
                  </h4>

                  <div
                    onDragEnter={(e) => handleDrag(e, course.id, true)}
                    onDragLeave={(e) => handleDrag(e, course.id, false)}
                    onDragOver={(e) => handleDrag(e, course.id, true)}
                    onDrop={(e) => handleDrop(e, course.id)}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-4 ${
                      dragActive === course.id
                        ? "border-primary-400 bg-primary-50"
                        : "border-cream-400 hover:border-primary-300"
                    }`}
                  >
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">
                      גרור קבצים לכאן או לחץ לבחירה
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, Word, PowerPoint
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      id={`upload-${course.id}`}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      multiple
                      onChange={(e) =>
                        handleFileUpload(course.id, e.target.files)
                      }
                    />
                    <label
                      htmlFor={`upload-${course.id}`}
                      className="btn-secondary text-sm mt-3 inline-block cursor-pointer"
                    >
                      בחר קבצים
                    </label>
                  </div>

                  {/* Material Type Labels */}
                  <div className="flex gap-2 mb-4">
                    {MATERIAL_TYPES.map((mt) => {
                      const Icon = mt.icon;
                      return (
                        <span
                          key={mt.value}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-cream-200 rounded-full text-sm text-primary-600"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {mt.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Existing Materials */}
                  {course.materials.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        חומרים שהועלו ({course.materials.length})
                      </h4>
                      {course.materials.map((mat) => {
                        const typeInfo = MATERIAL_TYPES.find(
                          (t) => t.value === mat.type
                        );
                        const Icon = typeInfo?.icon || FileText;
                        return (
                          <div
                            key={mat.id}
                            className="flex items-center justify-between p-3 bg-cream-100 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-primary-500" />
                              <div>
                                <p className="text-sm font-medium text-primary-700">
                                  {mat.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {typeInfo?.label || mat.type}
                                  {mat.year && ` | ${mat.year}`}
                                  {mat.processed && " | עובד"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMaterial(mat.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Scraper */}
                  <div className="pt-4 border-t border-cream-300">
                    <h4 className="font-bold text-primary-600 mb-3 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      הורדת מבחנים מהפורטל
                    </h4>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        className="input-field flex-1"
                        placeholder="הדבק כתובת URL של עמוד המבחנים..."
                        dir="ltr"
                      />
                      <button
                        onClick={() => handleScrape(course.id)}
                        disabled={!scrapeUrl || scraping}
                        className="btn-primary whitespace-nowrap disabled:opacity-50"
                      >
                        {scraping ? "מוריד..." : "הורד מבחנים"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      תומך ב-Moodle ופורטלים נפוצים של אוניברסיטאות ישראליות
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
