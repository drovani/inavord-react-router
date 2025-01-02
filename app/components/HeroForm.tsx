import { type UseFormReturn } from "react-hook-form";
import { data, useNavigate, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { HeroMutationSchema, type HeroMutation, type HeroRecord } from "~/data/hero.zod";
// import ArtifactsField from "./hero-form/ArtifactsField";
import { ZodError } from "zod";
import SkinsField from "~/components/hero-form/SkinsField";
import type { EquipmentRecord } from "~/data/equipment.zod";
import GlyphsField from "./hero-form/GlyphsField";
import ItemsField from "./hero-form/ItemsField";

interface HeroFormProps {
  form: UseFormReturn<HeroMutation>;
  hero: HeroRecord;
  equipment: EquipmentRecord[];
}

export default function HeroForm({ form, hero, equipment }: HeroFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const onSubmit = (submittedData: HeroMutation) => {
    try {
      const validated = HeroMutationSchema.parse(submittedData);

      const formData = new FormData();
      formData.append("hero", JSON.stringify(validated));
      submit(formData, { method: "post" });
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return data({ errors: error.format() }, { status: 400 });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* <ArtifactsField form={form} hero={hero} /> */}
        <GlyphsField form={form} hero={hero} />
        <ItemsField form={form} hero={hero} equipment={equipment} />
        <SkinsField form={form} hero={hero} />

        <div className="flex gap-4">
          <Button type="submit">Save Hero</Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
