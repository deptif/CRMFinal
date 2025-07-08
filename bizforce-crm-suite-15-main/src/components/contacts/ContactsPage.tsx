import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Building2,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ContactModal } from './ContactModal';
import { useSupabaseContacts } from '@/hooks/useSupabaseContacts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Contact } from '@/types';

export const ContactsPage = () => {
  const { contacts, isLoading, createContact, updateContact, deleteContact, refetch } = useSupabaseContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    try {
      await createContact(contactData);
      setIsModalOpen(false);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleUpdateContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    if (!editingContact) return;
    
    try {
      await updateContact(editingContact.id, contactData);
      setEditingContact(null);
      setIsModalOpen(false);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleDeleteConfirm = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteContact(contactToDelete.id);
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      // Error já tratado no hook
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando contactos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-600">Gerir contactos e relacionamentos</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Contacto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Contactos ({filteredContacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contacto encontrado</h3>
              <p className="text-gray-600 mb-4">Comece adicionando o seu primeiro contacto</p>
              <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contacto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {contact.first_name[0]}{contact.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {contact.title}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {contact.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {contact.phone}
                        </span>
                        <span className="flex items-center">
                          <Building2 className="h-3 w-3 mr-1" />
                          {contact.account_name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm text-gray-500 mr-4">
                      <p className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {contact.owner_name}
                      </p>
                      <p>{contact.created_at.toLocaleDateString('pt-PT')}</p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditContact(contact)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteConfirm(contact)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
        editingContact={editingContact}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (isDeleting) return;
        setIsDeleteDialogOpen(open);
        if (!open) {
          setContactToDelete(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá eliminar permanentemente o contacto
              "{contactToDelete?.first_name} {contactToDelete?.last_name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
