document.addEventListener('DOMContentLoaded', function() {
    // Formatação de inputs especiais como CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})/, '$1.$2.');
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})/, '$1.');
            }
            
            e.target.value = value;
        });
    }

    // Preview de imagem para upload de foto
    const photoInput = document.getElementById('photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Criar preview da imagem (opcional)
                    const preview = document.createElement('div');
                    preview.className = 'photo-preview';
                    preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    
                    // Remover preview anterior se existir
                    const oldPreview = document.querySelector('.photo-preview');
                    if (oldPreview) {
                        oldPreview.remove();
                    }
                    
                    // Adicionar novo preview
                    photoInput.parentNode.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Preview de imagem para upload de documento
    const documentInput = document.getElementById('document');
    if (documentInput) {
        documentInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Criar preview da imagem (opcional)
                    const preview = document.createElement('div');
                    preview.className = 'document-preview';
                    preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                    
                    // Remover preview anterior se existir
                    const oldPreview = document.querySelector('.document-preview');
                    if (oldPreview) {
                        oldPreview.remove();
                    }
                    
                    // Adicionar novo preview
                    documentInput.parentNode.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Validação básica de formulário
    const registerForm = document.querySelector('form[action="/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const cpf = document.getElementById('cpf');
            const address = document.getElementById('address');
            const photo = document.getElementById('photo');
            const document = document.getElementById('document');
            
            let isValid = true;
            
            // Validação básica de preenchimento
            if (!name.value.trim()) {
                highlightError(name, 'Nome é obrigatório');
                isValid = false;
            }
            
            if (!email.value.trim()) {
                highlightError(email, 'E-mail é obrigatório');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                highlightError(email, 'E-mail inválido');
                isValid = false;
            }
            
            if (!cpf.value.trim()) {
                highlightError(cpf, 'CPF é obrigatório');
                isValid = false;
            } else if (cpf.value.replace(/\D/g, '').length !== 11) {
                highlightError(cpf, 'CPF inválido');
                isValid = false;
            }
            
            if (!address.value.trim()) {
                highlightError(address, 'Endereço é obrigatório');
                isValid = false;
            }
            
            // Verificar se uma foto foi enviada
            if (photo && !photo.value) {
                highlightError(photo, 'Foto é obrigatória');
                isValid = false;
            }
            
            // Verificar se um documento foi enviado
            if (document && !document.value) {
                highlightError(document, 'Documento é obrigatório');
                isValid = false;
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Animação de scroll suave para links de ancoragem
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Função para destacar campos com erro
    function highlightError(inputElement, message) {
        inputElement.classList.add('error');
        
        // Adicionar mensagem de erro se ainda não existir
        let errorMessage = inputElement.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('p');
            errorMessage.className = 'error-message';
            inputElement.parentNode.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        
        // Remover destacamento após correção
        inputElement.addEventListener('input', function() {
            this.classList.remove('error');
            errorMessage.textContent = '';
        }, { once: true });
    }

    // Função para validar e-mail
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Inicializar barras de progresso no dashboard
    const progressBars = document.querySelectorAll('.progress-bar .progress');
    progressBars.forEach(bar => {
        const value = parseInt(bar.style.width);
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = `${value}%`;
            bar.style.transition = 'width 1.5s ease-in-out';
        }, 300);
    });
});