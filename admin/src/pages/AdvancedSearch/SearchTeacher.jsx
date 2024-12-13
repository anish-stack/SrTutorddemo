import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import SearchForm from './SearchForm';
import TeacherCard from './TeacherCard';
import SubjectFilter from './SubjectFilter';
import { ShieldAlert } from 'lucide-react';
const SearchTeacher = () => {
    // State management
    const [formData, setFormData] = useState({
        searchLocation: '',
        classSearch: '',
        classId: '',
        radius: 5
    });
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [classData, setClassData] = useState([]);
    const [concatenatedData, setConcatenatedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const teachersPerPage = 6;

    // Fetch classes data
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('https://api.srtutorsbureau.com/api/v1/admin/Get-Classes');
                const classes = response.data.data.sort((a, b) => a.position - b.position);
                setClassData(classes);
            } catch (err) {
                setError('Failed to fetch classes');
                toast.error('Error loading classes');
            }
        };
        fetchClasses();
    }, []);

    // Process class data
    useEffect(() => {
        if (classData.length > 0) {
            const filterOutClasses = ['I-V', 'VI-VIII', 'IX-X', 'XI-XII'];
            const filteredClasses = classData
                .filter(item => !filterOutClasses.includes(item.Class))
                .map(item => ({ class: item.Class, id: item._id }));

            const rangeClasses = classData
                .filter(item => item.InnerClasses?.length > 0)
                .flatMap(item => item.InnerClasses.map(innerClass => ({
                    class: innerClass.InnerClass,
                    id: innerClass._id
                })));

            setConcatenatedData([...rangeClasses, ...filteredClasses]);
        }
    }, [classData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (name === 'searchLocation') {
            autoComplete(value);

        }
    };

    // Auto-complete location
    const autoComplete = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.get(
                `https://api.srtutorsbureau.com/autocomplete?input=${query}`
            );
            setSuggestions(response.data);
        } catch (error) {
            console.error('Autocomplete error:', error);
        }
    };

    // Handle search
    const handleSearch = async () => {
        if (!formData.searchLocation || !formData.classSearch) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('https://api.srtutorsbureau.com/api/v1/admin/make-search', formData);
            setTeachers(response.data.data);
            console.log(response.data);
            setFilteredTeachers(response.data.data);
            setCurrentPage(1);
        } catch (error) {
            setError('Search failed');
            toast.error('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    // Handle subject filtering
    const handleSubjectChange = (subject) => {
        setSelectedSubjects(prev => {
            const newSubjects = prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject];

            const filtered = teachers.filter(teacher =>
                teacher.AcademicInformation.some(info =>
                    info.SubjectNames.some(s => newSubjects.length === 0 || newSubjects.includes(s))
                )
            );
            console.log(filtered)

            setFilteredTeachers(filtered);
            setCurrentPage(1);
            return newSubjects;
        });
    };

    // Pagination
    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
    const totalPages = Math.ceil(teachers.length / teachersPerPage);

    // Loading and error states
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px] text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <SearchForm
                formData={formData}
                handleInputChange={handleInputChange}
                suggestions={suggestions}
                handleSearch={handleSearch}
                concatenatedData={concatenatedData}
            />

            {loading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : teachers.length > 0 ? (
                <>
                    <SubjectFilter
                        subjects={Array.from(new Set(teachers.flatMap(t =>
                            t.AcademicInformation.flatMap(info => info.SubjectNames)
                        )))}
                        selectedSubjects={selectedSubjects}
                        onSubjectChange={handleSubjectChange}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {currentTeachers.map((teacher) => (
                            <TeacherCard key={teacher._id} teacher={teacher} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) :

            <>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <ShieldAlert className="text-red-400" />
                <div>
                  <p className="text-lg font-medium text-red-600">No teachers found matching your search criteria.</p>
                  <p className="text-sm text-gray-600 mt-1">Please try adjusting the search parameters or selecting different classes.</p>
                </div>
              </div>
            </div>
          </>
          }
        </div>
    );
};

export default SearchTeacher;