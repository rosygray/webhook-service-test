<script>
    import axios from 'axios';
    import Swal from 'sweetalert2'; 

    let webhookId = 0;
    let name = '';
    let url = '';
    let auth_token = '';
    let enabled = true;
    let template_urls = '';
    let triggerData = '';
    let webhooks = [];

    const apiBaseUrl = 'http://localhost:3000/webhooks';

    async function createWebhook() {
        const urlsArray = template_urls.split(',').map(item => item.trim());
        try {
            await axios.post(apiBaseUrl, {
                name,
                url,
                auth_token,
                enabled,
                template_urls: urlsArray
            });
            await getWebhooks();
            resetForm();
            Swal.fire('Success', 'Webhook created successfully!', 'success'); 
        } catch (error) {
            Swal.fire('Error', error.response ? error.response.data.error : error.message, 'error');
        }
    }

    async function updateWebhook(id) {
        const urlsArray = template_urls.split(',').map(item => item.trim());
        try {
            await axios.put(`${apiBaseUrl}/${id}`, {
                name,
                url,
                auth_token,
                enabled,
                template_urls: urlsArray
            });
            await getWebhooks();
            resetForm();
            Swal.fire('Success', 'Webhook updated successfully!', 'success'); 
        } catch (error) {
            Swal.fire('Error', error.response ? error.response.data.error : error.message, 'error');
        }
    }

    async function deleteWebhook(id) {
        try {
            await axios.delete(`${apiBaseUrl}/${id}`);
            await getWebhooks();
            webhookId = 0; 
            Swal.fire('Success', 'Webhook deleted successfully!', 'success'); 
        } catch (error) {
            Swal.fire('Error', error.response ? error.response.data.error : error.message, 'error');
        }
    }

    async function triggerWebhook(id) {
        try {
            await axios.post(`${apiBaseUrl}/${id}/trigger`, {
                data: JSON.parse(triggerData)
            });
            Swal.fire('Success', 'Webhook triggered successfully!', 'success'); 
        } catch (error) {
            Swal.fire('Error', error.response ? error.response.data.error : error.message, 'error');
        }
    }

    async function getWebhooks() {
        try {
            const response = await axios.get(apiBaseUrl);
            webhooks = response.data;
        } catch (error) {
            console.error("Failed to fetch webhooks:", error);
        }
    }

    function resetForm() {
        name = '';
        url = '';
        auth_token = '';
        enabled = true;
        template_urls = '';
        webhookId = 0; 
    }

    getWebhooks();
</script>

<main class="container mt-4">
    <h1 class="mb-4">Webhook Management</h1>

    <h2 class="mb-3">Create/Update Webhook</h2>
    <form on:submit|preventDefault={() => webhookId ? updateWebhook(webhookId) : createWebhook()}>
        <div class="form-group">
            <input class="form-control" placeholder="Name" bind:value={name} required />
        </div>
        <div class="form-group">
            <input class="form-control" placeholder="URL" bind:value={url} required />
        </div>
        <div class="form-group">
            <input class="form-control" placeholder="Auth Token" bind:value={auth_token} required />
        </div>
        <div class="form-group form-check">
            <input type="checkbox" class="form-check-input" bind:checked={enabled} />
            <label class="form-check-label">Enabled</label>
        </div>
        <div class="form-group">
            <textarea class="form-control" placeholder="Template URLs (comma separated)" bind:value={template_urls} required></textarea>
        </div>
        <button class="btn btn-primary mb-3" type="submit">{webhookId ? 'Update Webhook' : 'Create Webhook'}</button>
    </form>

    <h2 class="mb-3">Trigger Replace/Data</h2>
    <textarea class="form-control" id="data" placeholder="Trigger Data (JSON format)" bind:value={triggerData} required></textarea>

    <h2 class="mb-3">Webhooks</h2>
    <ul class="list-group mb-4">
        {#each webhooks as webhook}
            <li class="list-group-item">
                <p><strong>WebhookID:</strong> {webhook.id}</p>
                <p><strong>Name:</strong> {webhook.name}</p>
                <p><strong>URL:</strong> {webhook.url}</p>
                <p><strong>Template URLs:</strong> {webhook.template_urls.join(', ')}</p>
                <div class="btn-group">
                    <button class="btn btn-warning" on:click={() => triggerWebhook(webhook.id)}>Trigger</button>
                    <button class="btn btn-info" on:click={() => {
                        name = webhook.name;
                        url = webhook.url;
                        auth_token = webhook.auth_token;
                        enabled = webhook.enabled;
                        template_urls = webhook.template_urls.join(', ');
                        webhookId = webhook.id; 
                    }}>Edit</button>
                    <button class="btn btn-danger" on:click={() => deleteWebhook(webhook.id)}>Delete</button>
                </div>
            </li>
        {/each}
    </ul>


</main>

<style>
    main {
        padding: 20px;
        background-color: #f8f9fa; /* Light background color */
        border-radius: 5px; /* Rounded corners */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    }
    h1, h2 {
        color: #343a40; /* Dark color for headings */
    }
</style>
