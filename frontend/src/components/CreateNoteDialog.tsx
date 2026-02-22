import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import * as Yup from "yup";
import { ErrorMessage, Field, Formik } from "formik"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useNotes } from "@/hooks/useNotes"

const CreateNoteSchema = Yup.object().shape({
    title: Yup.string().required("Please provide a title for your note"),
    tags: Yup.string(),
    content: Yup.string().optional(),
})


const CreateNoteDialog = () => {
    const { createNote } = useNotes()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (values: { title: string; content: string; tags: string }) => {
        try {
            setError(null)
            setIsLoading(true)
            await createNote({
                title: values.title,
                content: values.content || undefined,
                tags: values.tags?.trim() || undefined,
            })
            setOpen(false)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create note'
            setError(errorMessage)
            console.error('Failed to create note:', error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-3/4 h-10 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-1">
                <Plus size={20}/>
                <p>
                    Create New Note
                </p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create A New Note</DialogTitle>
                </DialogHeader>
                <Formik initialValues={{ title: "", content: "", tags: "" }} validationSchema={CreateNoteSchema} onSubmit={handleSubmit}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                <div className="mb-1 text-sm font-medium">Title</div>
                                <Field name="title" type="text" placeholder="Note title" className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-700" />
                                <div className="text-sm text-red-600 mt-1"><ErrorMessage name="title" /></div>
                            </label>
                            {/* Todo : Turn it into a select input */}
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                <div className="mb-1 text-sm font-medium">Tags</div>
                                <Field name="tags" type="text" placeholder="Note tags" className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-700" />
                                <div className="text-sm text-red-600 mt-1"><ErrorMessage name="tags" /></div>
                            </label>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                <div className="mb-1 text-sm font-medium">Content</div>
                                <Field id="content" name="content" as="textarea" placeholder="Note content" className="w-full rounded-md border px-3 py-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-700" />
                                <div className="text-sm text-red-600 mt-1"><ErrorMessage name="content" /></div>
                                {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
                            </label>
                            <button type="submit" disabled={isLoading} className="w-full rounded-md bg-sky-600 text-white px-4 py-2 hover:opacity-95 disabled:opacity-60">
                                {isLoading ? 'Creating...' : 'Create Note'}
                            </button>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default CreateNoteDialog