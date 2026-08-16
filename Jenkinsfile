// Alternative to .github/workflows/{api,client}.yml — use this only if you
// end up self-hosting Jenkins (e.g. on a VPS you already have), since
// Jenkins itself needs a server to run on. If GitHub Actions works for you,
// you don't need this file at all; the two aren't meant to run together.
//
// Requires on the Jenkins agent: Docker installed, and a "ghcr-credentials"
// Jenkins credential (username + a GitHub PAT with write:packages scope).

pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io/<your-github-username>"
        API_IMAGE = "${REGISTRY}/tools-techbanda-api"
        CLIENT_IMAGE = "${REGISTRY}/tools-techbanda-client"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & push API image') {
            when {
                anyOf {
                    changeset "server/**"
                    triggeredBy cause: 'UserIdCause' // allow manual "Build Now"
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | docker login ghcr.io -u "$REG_USER" --password-stdin
                        docker build -t ${API_IMAGE}:latest -t ${API_IMAGE}:${GIT_COMMIT} ./server
                        docker push ${API_IMAGE}:latest
                        docker push ${API_IMAGE}:${GIT_COMMIT}
                    '''
                }
            }
        }

        stage('Build & push Client image') {
            when {
                anyOf {
                    changeset "client/**"
                    triggeredBy cause: 'UserIdCause'
                }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'ghcr-credentials', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | docker login ghcr.io -u "$REG_USER" --password-stdin
                        docker build -t ${CLIENT_IMAGE}:latest -t ${CLIENT_IMAGE}:${GIT_COMMIT} ./client
                        docker push ${CLIENT_IMAGE}:latest
                        docker push ${CLIENT_IMAGE}:${GIT_COMMIT}
                    '''
                }
            }
        }

        // Deploy stages — same "needs a Docker-capable host" caveat as the
        // GitHub Actions workflows. Uncomment and fill in once you have one.
        //
        // stage('Deploy') {
        //     steps {
        //         sshagent(['deploy-ssh-key']) {
        //             sh '''
        //                 ssh deploy@your-vps "docker pull ${API_IMAGE}:latest && \
        //                     docker pull ${CLIENT_IMAGE}:latest && \
        //                     docker compose -f /path/to/tools-techbanda/docker-compose.yml up -d"
        //             '''
        //         }
        //     }
        // }
    }
}
