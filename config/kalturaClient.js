const kaltura = require('kaltura-client');
const { Promise } = require('mongoose');
const config = new kaltura.Configuration();
config.serviceUrl = 'https://www.kaltura.com';
const client = new kaltura.Client(config);

const UPLOAD_OPTIONS = {
    resume: false,
    finalChunk: true,
    resumeAt: -1,
}

let {
    SECRET,
    KALTURA_USER_ID,
    KALTURA_SESSION_TYPE,
    KALTURA_PARTNER_ID,
    KALTURA_EXPIRY,
    KALTURA_PRIVILEGES
} = process.env

class KalturaClient {
    async start() {
        return new Promise((resolve, reject) => {
            kaltura.services.session.start(SECRET, KALTURA_USER_ID, KALTURA_SESSION_TYPE, KALTURA_PARTNER_ID, KALTURA_EXPIRY, KALTURA_PRIVILEGES)
                .completion((success, ks) => {
                    if (!success) reject(new Error(ks));
                    client.setKs(ks);
                    resolve()
                }).execute(client)
        })
    }

    async addToken() {
        return new Promise((resolve, reject) => {
            let uploadToken = new kaltura.objects.UploadToken();

            kaltura.services.uploadToken.add(uploadToken)
                .execute(client)
                .then(result => resolve(result.id))
                .catch(error => reject(error))
        })
    }

    async uploadVideo({ files }) {
        return new Promise(async (resolve, reject) => {
            const serializedUploadResults = [],
                  errors = []

            files = Array.isArray(files) ? files : [files];

            await Promise.all(files.map(async currentFile => {
                const uploadTokenId = await this.addToken()
                await kaltura.services.uploadToken
                    .upload(uploadTokenId, currentFile.path, UPLOAD_OPTIONS.resume, UPLOAD_OPTIONS.finalChunk, UPLOAD_OPTIONS.resumeAt)
                    .execute(client)
                    .then(async uploadResult =>
                        serializedUploadResults.push(await this.createMediaAndAttachVideo({ uploadResult, file: currentFile }))
                    )
                    .catch(error => errors.push({ ...error, file: currentFile.name }));
            }))

            if (serializedUploadResults.length) resolve({ files: serializedUploadResults, errors })

            reject(errors)
        })
    }

    async createMediaAndAttachVideo({ uploadResult, file }) {
        return new Promise(async (resolve, reject) => {
            try {
                let media = await this.createMediaEntry(file)
                let attachedFilesToMedia = await this.attachFilesToMedia({ media, file: uploadResult });
                uploadResult = this.serializeResults(uploadResult)
                uploadResult.file = this.serializeAttachedFiles(attachedFilesToMedia)

                resolve(uploadResult)
            } catch (error) {
                reject(error)
            }
        })
    }

    async createMediaEntry(file) {
        return new Promise(async (resolve, reject) => {
            let entry = new kaltura.objects.MediaEntry({
                mediaType: kaltura.enums.MediaType.VIDEO,
                name: file.name,
                description: file.type
            });

            kaltura.services.media.add(entry)
                .execute(client)
                .then(result => resolve(result))
                .catch(error => reject(error));
        })
    }

    async attachFilesToMedia({ file, media }) {
        return new Promise(async (resolve, reject) => {
            let resource = new kaltura.objects.UploadedFileTokenResource();
            resource.token = file.id;

            kaltura.services.media.addContent(media.id, resource)
                .execute(client)
                .then(result => resolve(result))
                .catch(error => reject(error));
        })
    }

    serializeAttachedFiles({ id, name, description, status, downloadUrl, searchText, thumbnailUrl }) {
        return ({ id, name, description, status, downloadUrl, searchText, thumbnailUrl })
    }

    serializeResults({ id, fileName, uploadedFileSize, createdAt, updatedAt, status }) {
        return ({ id, fileName, uploadedFileSize, createdAt, updatedAt, status })
    }
}

module.exports = KalturaClient