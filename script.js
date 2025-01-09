const API_KEY = 'AIzaSyBFmU18wFZhJINdPCyDXLFbbL6hQk8UsZo';

// Fonction pour récupérer et afficher les sous-titres
async function fetchCaptions(videoId) {
  try {
    // Étape 1 : Obtenir la liste des sous-titres
    const response = await $.ajax({
      url: `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`,
      type: 'GET'
    });

    // Sélection du premier sous-titre disponible
    const captionId = response.items[0]?.id;
    if (!captionId) {
      $('#output').html('<p>Aucun sous-titre trouvé.</p>');
      return;
    }

    // Étape 2 : Télécharger les sous-titres
    const subtitleResponse = await $.ajax({
      url: `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt&key=${API_KEY}`,
      type: 'GET'
    });

    // Afficher les sous-titres
    $('#output').text(subtitleResponse);
    $('#downloadSection').removeClass('d-none');

    // Ajouter un gestionnaire de téléchargement
    $('#downloadText').off('click').on('click', () => {
      downloadTextFile(subtitleResponse, 'sous-titres.txt');
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des sous-titres :', error);
    $('#output').html('<p>Erreur lors de la récupération des sous-titres.</p>');
  }
}

// Fonction pour télécharger un fichier texte
function downloadTextFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

// Gestionnaire d'événement au clic
$(document).ready(() => {
  $('#fetchCaptions').click(() => {
    const videoId = $('#videoId').val();
    if (!videoId) {
      alert('Veuillez entrer un ID de vidéo.');
      return;
    }
    fetchCaptions(videoId);
  });
});
