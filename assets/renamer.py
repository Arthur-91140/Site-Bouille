#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import shutil
from pathlib import Path
import json

class ImageRenamer:
    def __init__(self, root_path="."):
        self.root_path = Path(root_path).resolve()
        self.image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg'}
        self.tree_structure = {}
        
    def is_image_file(self, file_path):
        """Vérifie si le fichier est une image"""
        return file_path.suffix.lower() in self.image_extensions
    
    def get_image_files_in_directory(self, directory):
        """Récupère tous les fichiers images dans un dossier donné"""
        images = []
        for file_path in directory.iterdir():
            if file_path.is_file() and self.is_image_file(file_path):
                images.append(file_path)
        return sorted(images)
    
    def rename_images_in_directory(self, directory):
        """Renomme les images dans un dossier selon le pattern demandé"""
        images = self.get_image_files_in_directory(directory)
        if not images:
            return []
        
        folder_name = directory.name
        renamed_files = []
        
        for i, image_path in enumerate(images, 1):
            # Nouveau nom : nom_du_dossier + numéro + .png
            new_name = f"{folder_name}{i}.png"
            new_path = directory / new_name
            
            # Éviter les conflits de noms
            counter = 1
            while new_path.exists() and new_path != image_path:
                new_name = f"{folder_name}{i}_{counter}.png"
                new_path = directory / new_name
                counter += 1
            
            # Renommer le fichier
            if image_path != new_path:
                try:
                    image_path.rename(new_path)
                    print(f"Renommé: {image_path.name} -> {new_name}")
                    renamed_files.append(new_path.name)
                except Exception as e:
                    print(f"Erreur lors du renommage de {image_path}: {e}")
                    renamed_files.append(image_path.name)
            else:
                renamed_files.append(image_path.name)
        
        return renamed_files
    
    def process_all_directories(self):
        """Traite tous les dossiers récursivement"""
        print(f"Traitement du dossier racine: {self.root_path}")
        
        # Parcourir tous les dossiers
        for root, dirs, files in os.walk(self.root_path):
            current_path = Path(root)
            print(f"\nTraitement du dossier: {current_path}")
            
            # Renommer les images dans ce dossier
            renamed_files = self.rename_images_in_directory(current_path)
            
            # Construire l'arborescence
            relative_path = current_path.relative_to(self.root_path)
            path_parts = list(relative_path.parts) if relative_path.parts != ('.', ) else []
            
            # Créer la structure dans le dictionnaire
            current_dict = self.tree_structure
            for part in path_parts:
                if part not in current_dict:
                    current_dict[part] = {"folders": {}, "files": []}
                current_dict = current_dict[part]["folders"]
            
            # Ajouter les fichiers à la structure
            if not path_parts:
                # Dossier racine
                if "root" not in self.tree_structure:
                    self.tree_structure["root"] = {"folders": {}, "files": []}
                self.tree_structure["root"]["files"] = renamed_files
            else:
                # Naviguer jusqu'au bon endroit et ajouter les fichiers
                current_dict = self.tree_structure
                for part in path_parts[:-1]:
                    current_dict = current_dict[part]["folders"]
                current_dict[path_parts[-1]]["files"] = renamed_files
    
    def generate_tree_text(self, structure=None, level=0, prefix=""):
        """Génère l'arborescence sous forme de texte utilisable"""
        if structure is None:
            structure = self.tree_structure
        
        lines = []
        
        for key, value in structure.items():
            if key == "root":
                # Fichiers à la racine
                for file in value["files"]:
                    lines.append(f"{prefix}{file}")
                # Dossiers à la racine
                for folder_name, folder_data in value["folders"].items():
                    lines.append(f"{prefix}{folder_name}/")
                    # Fichiers dans ce dossier
                    for file in folder_data["files"]:
                        lines.append(f"{prefix}{folder_name}/{file}")
                    # Sous-dossiers
                    sub_lines = self.generate_tree_text(
                        {folder_name: folder_data}, level + 1, f"{prefix}{folder_name}/"
                    )
                    lines.extend(sub_lines)
            else:
                # Dossier normal
                folder_data = value
                # Fichiers dans ce dossier
                for file in folder_data["files"]:
                    lines.append(f"{prefix}{file}")
                # Sous-dossiers
                for subfolder_name, subfolder_data in folder_data["folders"].items():
                    lines.append(f"{prefix}{subfolder_name}/")
                    # Fichiers dans le sous-dossier
                    for file in subfolder_data["files"]:
                        lines.append(f"{prefix}{subfolder_name}/{file}")
                    # Récursion pour les sous-sous-dossiers
                    sub_lines = self.generate_tree_text(
                        {subfolder_name: subfolder_data}, level + 1, f"{prefix}{subfolder_name}/"
                    )
                    lines.extend(sub_lines)
        
        return lines
    
    def save_tree_structure(self, output_file="arborescence.txt"):
        """Sauvegarde l'arborescence dans un fichier texte"""
        tree_lines = []
        
        # Générer une liste simple de tous les chemins
        for root, dirs, files in os.walk(self.root_path):
            current_path = Path(root)
            relative_path = current_path.relative_to(self.root_path)
            
            # Ajouter le dossier
            if relative_path != Path('.'):
                tree_lines.append(f"{relative_path}/")
            
            # Ajouter les fichiers images dans ce dossier
            for file in files:
                file_path = current_path / file
                if self.is_image_file(file_path):
                    if relative_path != Path('.'):
                        tree_lines.append(f"{relative_path}/{file}")
                    else:
                        tree_lines.append(file)
        
        # Sauvegarder dans le fichier
        output_path = self.root_path / output_file
        with open(output_path, 'w', encoding='utf-8') as f:
            for line in sorted(tree_lines):
                f.write(f"{line}\n")
        
        print(f"\nArborescence sauvegardée dans: {output_path}")
        return output_path
    
    def run(self, output_file="arborescence.txt"):
        """Exécute le processus complet"""
        print("=== RENOMMAGE DES IMAGES ===")
        self.process_all_directories()
        
        print("\n=== GÉNÉRATION DE L'ARBORESCENCE ===")
        self.save_tree_structure(output_file)
        
        print("\n=== TERMINÉ ===")

def main():
    # Utilisation
    renamer = ImageRenamer(".")  # Dossier courant, modifiez selon besoin
    renamer.run("arborescence.txt")

if __name__ == "__main__":
    main()