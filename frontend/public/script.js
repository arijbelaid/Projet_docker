const API_URL = window.API_URL || 'http://localhost:3000';

// Éléments du modal
const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.querySelector('.btn-cancel');

// Charger les contacts au démarrage
document.addEventListener('DOMContentLoaded', loadContacts);

// Gestionnaire du formulaire d'ajout
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contact = {
        nom: document.getElementById('nom').value,
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value
    };

    try {
        const response = await fetch(`${API_URL}/api/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            document.getElementById('contactForm').reset();
            loadContacts();
        } else {
            alert('Erreur lors de l\'ajout du contact');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout du contact');
    }
});

// Gestionnaire du formulaire de modification
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const contact = {
        nom: document.getElementById('editNom').value,
        email: document.getElementById('editEmail').value,
        telephone: document.getElementById('editTelephone').value
    };

    try {
        const response = await fetch(`${API_URL}/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            closeModal();
            loadContacts();
        } else {
            alert('Erreur lors de la modification');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la modification');
    }
});

// Fermer le modal
function closeModal() {
    modal.style.display = 'none';
}

// Ouvrir le modal avec les données du contact
function openModal(contact) {
    document.getElementById('editId').value = contact.id;
    document.getElementById('editNom').value = contact.nom;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editTelephone').value = contact.telephone;
    modal.style.display = 'block';
}

// Charger tous les contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/api/contacts`);
        if (!response.ok) throw new Error('Erreur chargement');
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('contactsList').innerHTML = '<p>Erreur de chargement des contacts</p>';
    }
}

// Afficher les contacts
function displayContacts(contacts) {
    const container = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        container.innerHTML = '<p>Aucun contact trouvé</p>';
        return;
    }

    container.innerHTML = contacts.map(contact => `
        <div class="contact-card" data-id="${contact.id}">
            <div class="contact-info">
                <h3>${escapeHtml(contact.nom)}</h3>
                <p>📧 ${escapeHtml(contact.email)}</p>
                <p>📞 ${escapeHtml(contact.telephone)}</p>
            </div>
            <div class="contact-actions">
                <button class="edit" onclick="editContact(${contact.id})">Modifier</button>
                <button class="delete" onclick="deleteContact(${contact.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Supprimer un contact
async function deleteContact(id) {
    if (!confirm('Voulez-vous vraiment supprimer ce contact ?')) return;

    try {
        const response = await fetch(`${API_URL}/api/contacts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadContacts();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
    }
}

// Modifier un contact avec le modal
async function editContact(id) {
    try {
        // Récupérer les données du contact
        const response = await fetch(`${API_URL}/api/contacts`);
        const contacts = await response.json();
        const contact = contacts.find(c => c.id == id);
        
        if (contact) {
            openModal(contact);
        } else {
            alert('Contact non trouvé');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du contact');
    }
}

// Fonction utilitaire pour échapper les caractères HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Gestionnaires pour fermer le modal
closeBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;

// Fermer le modal en cliquant à l'extérieur
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
};