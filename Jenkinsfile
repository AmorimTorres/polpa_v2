pipeline {
    agent any
    
    tools {
        nodejs 'node' 
    }

    stages {
        stage('restore') {
            steps {
                echo ""
                echo "Restoring dependencies..."
                echo ""
                sh 'npm ci'
            }
        }
        stage('build') {
            steps {
                echo ""
                echo "Building the application..."
                echo ""
                sh 'npm run build'
            }
        }
    }
}
