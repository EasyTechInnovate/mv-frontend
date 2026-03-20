"use client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Check,
  Save,
  Upload,
} from "lucide-react";

export default function ContactPage({
  theme = "dark",
  contactInfo = {},
  physicalAddress = {},
  setContactInfo = () => { },
  isEditing = false,
  onRefresh = () => { },
  websiteLink = "", }) {
  const isDark = theme === "dark";

  const isValidPhone = (v) => !!v && /^\+?[0-9][0-9\s\-()]{8,}$/.test(v);
  const isValidEmail = (v) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidUrl = (v) => !!v && /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(v);


  const wrap = (cls = "") =>
    `rounded-xl border ${isDark ? "bg-[#151F28] border-gray-700" : "bg-white border-gray-200"
    } ${cls}`;

  const inputBase =
    "w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";
  const inputTheme = isDark
    ? "bg-[#0F1720] text-gray-200"
    : "bg-gray-100 text-[#111A22]";
  const badge = (ok) =>
    `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${ok ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
    }`;


  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [qr, setQr] = useState({ id: null, fileUrl: "", fileName: "", valid: false });
  const [addresses, setAddresses] = useState([]);
  const [website, setWebsite] = useState({ id: null, value: "", valid: false });
  const [hours, setHours] = useState({ id: null, value: "", valid: false });


  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);


  useEffect(() => {

    const phonesArr = [
      { id: "phone-primary", label: "Primary", value: contactInfo.primaryPhone || "" },
      { id: "phone-secondary", label: "Secondary", value: contactInfo.secondaryPhone || "" },
    ].map((p) => ({ ...p, valid: isValidPhone(p.value) }));
    setPhones(phonesArr);


    const emailsArr = [
      { id: "email-primary", label: "Primary Email", value: contactInfo.primaryEmail || "" },
      { id: "email-support", label: "Support Email", value: contactInfo.supportEmail || "" },
      { id: "email-business", label: "Business Email", value: contactInfo.businessEmail || "" },
      { id: "email-press", label: "Press & Media Email", value: contactInfo.pressEmail || "" },
      { id: "email-legal", label: "Infringements/Legal Email", value: contactInfo.legalEmail || "" },
    ].map((e) => ({ ...e, valid: isValidEmail(e.value) }));
    setEmails(emailsArr);


    const qrObj = {
      id: "whatsapp-qr",
      fileUrl: contactInfo.whatsappQRCode || "",
      fileName: contactInfo.whatsappQRCode ? contactInfo.whatsappQRCode.split("/").pop() : "",
      valid: isValidUrl(contactInfo.whatsappQRCode || ""),
    };
    setQr(qrObj);


    const addrVal = [
      {
        id: "addr-office",
        label: "Office Address",
        value:
          (contactInfo.physicalAddress &&

            [contactInfo.physicalAddress.street, contactInfo.physicalAddress.city, contactInfo.physicalAddress.state, contactInfo.physicalAddress.zipCode, contactInfo.physicalAddress.country]
              .filter(Boolean)
              .join(", ")) ||
          "",
      },
    ];

    setAddresses([
      { id: "street", label: "Street", value: physicalAddress?.street || "", valid: Boolean(physicalAddress?.street) },
      { id: "city", label: "City", value: physicalAddress?.city || "", valid: Boolean(physicalAddress?.city) },
      { id: "state", label: "State", value: physicalAddress?.state || "", valid: Boolean(physicalAddress?.state) },
      { id: "zipCode", label: "ZIP Code", value: physicalAddress?.zipCode || "", valid: Boolean(physicalAddress?.zipCode) },
      { id: "country", label: "Country", value: physicalAddress?.country || "", valid: Boolean(physicalAddress?.country) },
    ]);



    setWebsite({
      id: "website",
      value: contactInfo?.website || contactInfo?.officialWebsite || websiteLink || "",
      valid: isValidUrl(contactInfo?.website || contactInfo?.officialWebsite || websiteLink || ""),
    });


    setHours({
      id: "hours",
      value: contactInfo.businessHours || "",
      valid: Boolean(contactInfo.businessHours && contactInfo.businessHours.trim()),
    });
  }, [contactInfo]);


  const allValid = useMemo(() => {
    return (
      phones.every((p) => p.valid) &&
      emails.every((e) => e.valid) &&
      addresses.every((a) => a.valid) &&
      website.valid &&
      hours.valid
    );
  }, [phones, emails, addresses, website, hours]);


  const updatePhone = (id, val) => {
    setTouched(true);
    setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, value: val, valid: isValidPhone(val) } : p)));
  };

  const updateEmail = (id, val) => {
    setTouched(true);
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, value: val, valid: isValidEmail(val) } : e)));
  };


  const updateQrUrl = (url) => {
    setTouched(true);
    setQr((prev) => ({ ...prev, fileUrl: url, fileName: url ? url.split("/").pop() : "", valid: isValidUrl(url) }));
  };


  const addAddress = () => {
    setTouched(true);
    setAddresses((prev) => [
      ...prev,
      { id: `addr-${Date.now()}`, label: "New Address", value: "", valid: false },
    ]);
  };

  const updateAddress = (id, val) => {
    setTouched(true);
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, value: val, valid: Boolean(val.trim()) } : a)));
  };

  const updateWebsite = (val) => {
    setTouched(true);
    setWebsite((prev) => ({ ...prev, value: val, valid: isValidUrl(val) }));
  };

  const updateHours = (val) => {
    setTouched(true);
    setHours((prev) => ({ ...prev, value: val, valid: Boolean(val.trim()) }));
  };


  const handleSaveAll = async () => {

    const addrStr = (addresses[0] && addresses[0].value) || "";

    const payload = {
      primaryPhone: phones.find((p) => p.id === "phone-primary")?.value || null,
      secondaryPhone: phones.find((p) => p.id === "phone-secondary")?.value || null,
      primaryEmail: emails.find((e) => e.id === "email-primary")?.value || null,
      supportEmail: emails.find((e) => e.id === "email-support")?.value || null,
      businessEmail: emails.find((e) => e.id === "email-business")?.value || null,
      pressEmail: emails.find((e) => e.id === "email-press")?.value || null,
      legalEmail: emails.find((e) => e.id === "email-legal")?.value || null,
      whatsappQRCode: qr.fileUrl || null,

      physicalAddress: addresses.reduce((acc, field) => {
        acc[field.id] = field.value || null;
        return acc;
      }, {}),
      businessHours: hours.value || null,

      website: website.value || null,
    };

    try {
      setSaving(true);

      setContactInfo(payload);

      setTouched(false);

    } catch (err) {
      console.error("ContactPage.handleSaveAll:", err);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className={`space-y-8 ${isDark ? "text-white" : "text-[#111A22]"}`}>

      <div className="flex items-start md:items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold">Contact & Business Manager</h1>
          <p className="text-sm text-gray-400">
            Manage contact details and business information for your company
          </p>
        </div>

        <div className="hidden md:block">
          <Button
            onClick={handleSaveAll}
            disabled={!touched || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>


      <Card className={wrap()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="font-medium">Phone Numbers</span>
        </div>
        <CardContent className="p-4 space-y-4">
          {phones.map((p) => (
            <div key={p.id}>
              <label className="text-xs text-gray-400 block mb-2">{p.label}</label>
              <div className="relative">
                <input
                  type="tel"
                  value={p.value}
                  onChange={(e) => updatePhone(p.id, e.target.value)}
                  className={`${inputBase} ${inputTheme} pr-20`}
                  disabled={!isEditing ? true : false}
                />
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 ${badge(p.valid)}`}>
                  <Check className="w-3 h-3" />
                  {p.valid ? "Valid" : "Invalid"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className={wrap()}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Email Addresses</span>
          </div>
          <CardContent className="p-4 space-y-4">
            {emails.map((e) => (
              <div key={e.id}>
                <label className="text-xs text-gray-400 block mb-2">{e.label}</label>
                <div className="relative">
                  <input
                    type="email"
                    value={e.value}
                    onChange={(evt) => updateEmail(e.id, evt.target.value)}
                    className={`${inputBase} ${inputTheme} pr-20`}
                    disabled={!isEditing ? true : false}
                  />
                  <span
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${badge(e.valid)}`}
                  >
                    <Check className="w-3 h-3" />
                    {e.valid ? "Valid" : "Invalid"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={wrap()}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="font-medium">WhatsApp QR</span>
          </div>
          <CardContent className="p-6">
            <div className={`border-2 rounded-lg p-4 ${isDark ? "border-gray-700" : "border-gray-300"}`}>
              <label className="text-xs text-gray-400 block mb-2">WhatsApp QR image URL</label>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={qr.fileUrl || ""}
                  onChange={(e) => updateQrUrl(e.target.value)}
                  placeholder="https://example.com/whatsapp-qr.png"
                  className={`${inputBase} ${inputTheme}`}
                  disabled={!isEditing ? true : false}
                />
                <span className={`${badge(qr.valid)}`}>
                  <Check className="w-3 h-3" />
                  {qr.valid ? "Valid" : "Invalid"}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-2">Paste a public image URL (PNG/JPG) to show as WhatsApp QR.</p>

              {qr.fileUrl && qr.valid && (
                <div className="mt-4 flex flex-col items-center">
                  <img src={qr.fileUrl} className="max-h-40 object-contain mb-3 rounded-md" alt="WhatsApp QR preview" onError={(e) => (e.target.style.display = "none")} />
                  <p className="text-xs text-gray-400">Preview of your WhatsApp QR image</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card
          className={`rounded-xl border ${isDark ? "bg-[#151F28] border-gray-800" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-[17px]">Physical Address</span>
          </div>

          <CardContent className="p-6 space-y-6">


            <div>
              <label className="text-xs text-gray-400 mb-2 block">Street</label>
              <div className="relative">
                <input
                  type="text"
                  value={addresses.find((a) => a.id === "street")?.value || ""}
                  onChange={(e) => {
                    setTouched(true);
                    setAddresses((prev) =>
                      prev.map((addr) =>
                        addr.id === "street"
                          ? {
                            ...addr,
                            value: e.target.value,
                            valid: Boolean(e.target.value.trim()),
                          }
                          : addr
                      )
                    );
                  }}
                  placeholder="Enter street address"
                  className={`w-full px-4 py-1.5 rounded-lg border ${isDark
                    ? "bg-[#111A22] border-gray-700 text-gray-200 placeholder-gray-500"
                    : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-400"
                    } focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${!isEditing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  disabled={!isEditing}
                />
                {addresses.find((a) => a.id === "street")?.valid && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                    <Check className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {["city", "zipCode"].map((field) => {
                const a = addresses.find((addr) => addr.id === field);
                return (
                  <div key={field}>
                    <label className="text-xs text-gray-400 mb-2 block capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={a?.value || ""}
                        onChange={(e) => {
                          setTouched(true);
                          setAddresses((prev) =>
                            prev.map((addr) =>
                              addr.id === field
                                ? {
                                  ...addr,
                                  value: e.target.value,
                                  valid: Boolean(e.target.value.trim()),
                                }
                                : addr
                            )
                          );
                        }}
                        placeholder={`Enter ${field.toLowerCase()}`}
                        className={`w-full px-4 py-1.5 rounded-lg border ${isDark
                          ? "bg-[#111A22] border-gray-700 text-gray-200 placeholder-gray-500"
                          : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-400"
                          } focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${!isEditing ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        disabled={!isEditing}
                      />
                      {a?.valid && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {["state", "country"].map((field) => {
                const a = addresses.find((addr) => addr.id === field);
                return (
                  <div key={field}>
                    <label className="text-xs text-gray-400 mb-2 block capitalize">
                      {field}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={a?.value || ""}
                        onChange={(e) => {
                          setTouched(true);
                          setAddresses((prev) =>
                            prev.map((addr) =>
                              addr.id === field
                                ? {
                                  ...addr,
                                  value: e.target.value,
                                  valid: Boolean(e.target.value.trim()),
                                }
                                : addr
                            )
                          );
                        }}
                        placeholder={`Enter ${field.toLowerCase()}`}
                        className={`w-full px-4 py-1.5 rounded-lg border ${isDark
                          ? "bg-[#111A22] border-gray-700 text-gray-200 placeholder-gray-500"
                          : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-400"
                          } focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${!isEditing ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        disabled={!isEditing}
                      />
                      {a?.valid && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>


        <Card className={wrap()}>
          <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-gray-700">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-[17px]">
              Website & Business Hours
            </span>
          </div>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-2">Official Website</label>
              <div className="relative">
                <input
                  type="url"
                  value={website.value}
                  onChange={(e) => updateWebsite(e.target.value)}
                  className={`${inputBase} ${inputTheme} pr-20`}
                  disabled={!isEditing ? true : false}
                />
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 ${badge(website.valid)}`}>
                  <Check className="w-3 h-3" />
                  {website.valid ? "Valid" : "Invalid"}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-2">Business Hours</label>
              <textarea
                rows={3}
                value={hours.value}
                onChange={(e) => updateHours(e.target.value)}
                className={`${inputBase} ${inputTheme} resize-none`}
                disabled={!isEditing ? true : false}
              />
            </div>
          </CardContent>
        </Card>
      </div>


      <Card className={`${wrap()} mt-8`}>
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Contact Information Preview</h2>
          <p className="text-sm text-gray-400">This is how your contact information will appear to users</p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium">Phone Numbers</h3>
              </div>
              <ul className="space-y-4 text-sm">
                {phones.map((p) => (
                  <li key={p.id}>
                    <p className="text-gray-400">{p.label}</p>
                    <p className="text-gray-200 font-medium">{p.value}</p>
                  </li>
                ))}
              </ul>
            </div>


            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium">Email Addresses</h3>
              </div>
              <ul className="space-y-4 text-sm">
                {emails.map((e) => (
                  <li key={e.id}>
                    <p className="text-gray-400">{e.label}</p>
                    <p className="text-gray-200 font-medium">{e.value}</p>
                  </li>
                ))}
              </ul>
            </div>


            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium">Address & Website</h3>
              </div>
              <div className="space-y-4 text-sm">
                {addresses[0]?.value && (
                  <div>
                    <p className="text-gray-400">Office Address</p>
                    <p className="text-gray-200 font-medium">{addresses[0].value}</p>
                  </div>
                )}
                {website?.value && (
                  <div>
                    <p className="text-gray-400">Official Website</p>
                    <a
                      href={website.value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:underline font-medium"
                    >
                      {website.value}
                    </a>
                  </div>
                )}
                {hours?.value && (
                  <div>
                    <p className="text-gray-400">Business Hours</p>
                    <p className="text-gray-200 font-medium whitespace-pre-line">{hours.value}</p>
                  </div>
                )}


               {qr.fileUrl && qr.valid && (
  <div className="mt-4">
    <p className="text-gray-400 text-xs mb-1">WhatsApp QR</p>

    <a
      href={qr.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full truncate text-sm underline ${
        isDark ? "text-purple-400 hover:text-purple-300" : "text-blue-600 hover:text-blue-500"
      }`}
    >
      {qr.fileUrl}
    </a>
  </div>
)}

              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="md:hidden flex justify-end">
        <Button onClick={handleSaveAll} disabled={!touched || saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
