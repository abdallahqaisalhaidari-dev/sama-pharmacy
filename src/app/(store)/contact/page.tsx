"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/utils";
import { useSettings } from "@/components/settings-provider";

export default function ContactPage() {
  const settings = useSettings();

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "واتساب",
      value: "اضغط للتواصل عبر واتساب",
      color: "bg-green-50 text-green-600 border-green-100",
      action: () => {
        window.open(
          generateWhatsAppLink("مرحباً، أريد الاستفسار عن...", settings.whatsapp),
          "_blank"
        );
      },
    },
    {
      icon: Phone,
      label: "الهاتف",
      value: settings.phone,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      action: () =>
        window.open(`tel:${settings.phone.replace(/[^0-9+]/g, "")}`),
    },
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: settings.email,
      color: "bg-brand-purple-50 text-brand-purple-500 border-brand-purple-100",
      action: () => window.open(`mailto:${settings.email}`),
    },
    {
      icon: MapPin,
      label: "العنوان",
      value: settings.address,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      action: undefined,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">اتصل بنا</h1>
        <p className="text-lg text-gray-500">
          نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك
        </p>
      </motion.div>

      {/* Contact Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={method.action}
            className={`bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition-all duration-300 ${
              method.action ? "cursor-pointer" : ""
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mb-4 border`}
            >
              <method.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {method.label}
            </h3>
            <p className="text-gray-600" dir={method.label === "الهاتف" ? "ltr" : undefined}>
              {method.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Working Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-brand-purple-50 rounded-2xl p-8 border border-brand-purple-100 text-center"
      >
        <Clock className="w-10 h-10 text-brand-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ساعات العمل</h2>
        <p className="text-gray-700">{settings.working_hours}</p>
      </motion.div>
    </div>
  );
}
