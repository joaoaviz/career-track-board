
export function validateApplicationForm(formData: Record<string, any>) {
  const newErrors: Record<string, string> = {};

  if (!formData.jobTitle.trim()) {
    newErrors.jobTitle = "Le nom du poste est requis";
  }

  if (!formData.companyName.trim()) {
    newErrors.companyName = "Le nom de l'entreprise est requis";
  }

  if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
    newErrors.contactEmail = "Email invalide";
  }

  // Only check if present, not its content
  if (
    formData.linkedinUrl &&
    (!formData.linkedinUrl.startsWith("http://") && !formData.linkedinUrl.startsWith("https://"))
  ) {
    newErrors.linkedinUrl = "URL invalide. Doit commencer par http:// ou https://";
  }

  return newErrors;
}
